const express = require('express');
const { Post } = require('../models/sqlite');
const auth = require('../middleware/auth');

const router = express.Router();

// 게시글 목록 조회
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status = 'approved',
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    console.log('게시글 목록 조회:', { status, category, search });

    // SQLite 쿼리 조건 구성
    const where = { status };
    
    if (category) {
      where.category = category;
    }

    if (search) {
      where.title = { [require('sequelize').Op.like]: `%${search}%` };
    }

    const order = [[sortBy, sortOrder.toUpperCase()]];

    // SQLite에서 게시글 조회
    const { rows: posts, count: total } = await Post.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      include: [
        {
          model: require('../models/sqlite').User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });

    console.log(`게시글 ${posts.length}개 조회됨 (총 ${total}개)`);

    res.json({
      success: true,
      posts: posts.map(post => post.toJSON()),
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    res.status(500).json({ 
      success: false,
      message: '게시글을 가져오는 중 오류가 발생했습니다.' 
    });
  }
});

// 게시글 상세 조회
router.get('/:id', async (req, res) => {
  try {
    console.log(`게시글 ${req.params.id} 상세 조회 요청`);
    
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: require('../models/sqlite').User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });

    if (!post) {
      console.log(`게시글 ${req.params.id}를 찾을 수 없음`);
      return res.status(404).json({ 
        message: '게시글을 찾을 수 없습니다.' 
      });
    }

    console.log(`게시글 ${req.params.id} 조회 성공, 조회수 증가 전: ${post.views}`);

    // 조회수 증가
    post.views += 1;
    await post.update({ views: post.views });

    console.log(`게시글 ${req.params.id} 조회수 증가 완료: ${post.views}`);

    res.json({ post: post.toJSON() });
  } catch (error) {
    console.error('게시글 상세 조회 오류:', error);
    res.status(500).json({ 
      message: '게시글을 가져오는 중 오류가 발생했습니다.' 
    });
  }
});

// 게시글 작성
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ 
        success: false,
        message: '제목, 내용, 카테고리를 모두 입력해주세요.' 
      });
    }

    // SQLite 사용 - 정수 ID로 작성
    const post = await Post.create({
      title,
      content,
      category,
      tags: tags || [],
      author: req.userId, // SQLite에서는 정수 ID 사용
      status: 'pending', // 승인 대기 상태
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('게시글 작성 성공:', { id: post.id, title: post.title });

    res.status(201).json({
      success: true,
      message: '게시글이 작성되었습니다. 관리자 승인 후 공개됩니다.',
      post: post.toJSON()
    });
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    res.status(500).json({ 
      success: false,
      message: '게시글 작성 중 오류가 발생했습니다.' 
    });
  }
});

// 게시글 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        message: '게시글을 찾을 수 없습니다.' 
      });
    }

    // 작성자 또는 관리자만 수정 가능
    if (post.author !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: '게시글을 수정할 권한이 없습니다.' 
      });
    }

    const { title, content, category, tags } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = tags;

    await post.save();

    res.json({
      message: '게시글이 수정되었습니다.',
      post: post.toJSON()
    });
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    res.status(500).json({ 
      message: '게시글 수정 중 오류가 발생했습니다.' 
    });
  }
});

// 게시글 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        message: '게시글을 찾을 수 없습니다.' 
      });
    }

    // 작성자 또는 관리자만 삭제 가능
    if (post.author !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: '게시글을 삭제할 권한이 없습니다.' 
      });
    }

    await post.destroy();

    res.json({ 
      message: '게시글이 삭제되었습니다.' 
    });
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    res.status(500).json({ 
      message: '게시글 삭제 중 오류가 발생했습니다.' 
    });
  }
});

// 게시글 좋아요
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        message: '게시글을 찾을 수 없습니다.' 
      });
    }

    // SQLite에서는 JSON 필드로 likes 관리
    let likes = post.likes || [];
    const existingLike = likes.find(like => like.user === req.userId);

    if (existingLike) {
      // 좋아요 취소
      likes = likes.filter(like => like.user !== req.userId);
    } else {
      // 좋아요 추가
      likes.push({ user: req.userId, createdAt: new Date() });
    }

    await post.update({ likes });

    res.json({
      message: existingLike ? '좋아요가 취소되었습니다.' : '좋아요가 추가되었습니다.',
      likesCount: likes.length
    });
  } catch (error) {
    console.error('좋아요 처리 오류:', error);
    res.status(500).json({ 
      message: '좋아요 처리 중 오류가 발생했습니다.' 
    });
  }
});

// 댓글 작성
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ 
        message: '댓글 내용을 입력해주세요.' 
      });
    }

    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        message: '게시글을 찾을 수 없습니다.' 
      });
    }

    // SQLite에서는 JSON 필드로 comments 관리
    let comments = post.comments || [];
    const newComment = {
      author: req.userId,
      content,
      createdAt: new Date()
    };
    comments.push(newComment);

    await post.update({ comments });

    res.status(201).json({
      message: '댓글이 작성되었습니다.',
      comment: newComment
    });
  } catch (error) {
    console.error('댓글 작성 오류:', error);
    res.status(500).json({ 
      message: '댓글 작성 중 오류가 발생했습니다.' 
    });
  }
});

// 게시글 승인 (관리자 전용) - 임시로 권한 확인 제거
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`게시글 ${id} 승인 요청`);
    
    // SQLite 사용
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    
    await post.update({ status: 'approved' });
    
    console.log(`게시글 ${id} 승인 완료:`, post.toJSON());
    
    res.json({ 
      success: true, 
      message: '게시글이 승인되었습니다.',
      post: post.toJSON()
    });
  } catch (error) {
    console.error('게시글 승인 오류:', error);
    res.status(500).json({ 
      success: false,
      message: '게시글 승인 중 오류가 발생했습니다.' 
    });
  }
});

// 게시글 거부 (관리자 전용) - 임시로 권한 확인 제거
router.put('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`게시글 ${id} 거부 요청`);
    
    // SQLite 사용
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    
    await post.update({ status: 'rejected' });
    
    console.log(`게시글 ${id} 거부 완료:`, post.toJSON());
    
    res.json({ 
      success: true, 
      message: '게시글이 거부되었습니다.',
      post: post.toJSON()
    });
  } catch (error) {
    console.error('게시글 거부 오류:', error);
    res.status(500).json({ 
      success: false,
      message: '게시글 거부 중 오류가 발생했습니다.' 
    });
  }
});

module.exports = router;

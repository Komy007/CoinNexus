const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['analysis', 'strategy', 'news', 'education', 'general'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'pending'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }],
  metadata: {
    readingTime: Number, // 예상 읽기 시간 (분)
    wordCount: Number,
    lastModified: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// 인덱스 설정
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ featured: 1, createdAt: -1 });

// 가상 필드
postSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

postSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// JSON 변환 시 가상 필드 포함
postSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);

const Notice = require('../../models/Notice');

async function createNotice({ title, content, pinned }, user) {
  const notice = await Notice.create({
    title,
    content,
    pinned: pinned || false,
    postedById: user.userId,
    postedByName: user.name,
  });

  return notice;
}

async function getAllNotices() {
  return Notice.find().sort({ pinned: -1, createdAt: -1 });
}

async function deleteNotice(noticeId) {
  const notice = await Notice.findByIdAndDelete(noticeId);

  if (!notice) {
    const error = new Error('Notice not found');
    error.statusCode = 404;
    throw error;
  }

  return notice;
}

module.exports = { createNotice, getAllNotices, deleteNotice };
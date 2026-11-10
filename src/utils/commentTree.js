export function countComments(comments) {
  return comments.reduce((total, comment) => total + 1 + countComments(comment.replies || []), 0)
}

export function updateCommentTree(comments, targetId, updater) {
  return comments.map((comment) => {
    if (comment.id === targetId) return updater(comment)
    return {
      ...comment,
      replies: updateCommentTree(comment.replies || [], targetId, updater),
    }
  })
}

export function removeCommentTree(comments, targetId) {
  return comments
    .filter((comment) => comment.id !== targetId)
    .map((comment) => ({
      ...comment,
      replies: removeCommentTree(comment.replies || [], targetId),
    }))
}

export function findComment(comments, targetId) {
  for (const comment of comments) {
    if (comment.id === targetId) return comment
    const nested = findComment(comment.replies || [], targetId)
    if (nested) return nested
  }
  return null
}

export function flattenComments(comments) {
  return comments.flatMap((comment) => [comment, ...flattenComments(comment.replies || [])])
}

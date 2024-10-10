import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface CommentDoc extends BaseDoc {
  author: ObjectId;
  content: string;
  parent: ObjectId;
}

/**
 * concept: Commenting[Parent][Author]
 */
export default class CommentingConcept {
  public readonly comments: DocCollection<CommentDoc>;

  /**
   * Make an instance of commenting
   */
  constructor(name: string) {
    this.comments = new DocCollection<CommentDoc>(name);
  }

  async create(author: ObjectId, content: string, parent: ObjectId) {
    const _id = await this.comments.createOne({ author, content, parent });
    return { msg: "Successfully commented!", comment: await this.comments.readOne(_id) };
  }

  async getComments() {
    return await this.comments.readMany({}, { sort: { _id: -1 } });
  }

  async getCommentById(_id: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (comment === null) {
      throw new NotFoundError(`Post not found!`);
    }
    return comment;
  }

  async getByAuthor(author: ObjectId) {
    return await this.comments.readMany({ author: author });
  }

  async delete(_id: ObjectId) {
    await this.comments.deleteOne({ _id });
    return { msg: "Comment deleted." };
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (!comment) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    if (comment.author.toString() !== user.toString()) {
      throw new CommentAuthorNotMatchError(user, _id);
    }
  }
}

export class CommentAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of post {1}!", author, _id);
  }
}

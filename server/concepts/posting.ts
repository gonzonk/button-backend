import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface PostOptions {
  backgroundColor?: string;
}

export interface PostDoc extends BaseDoc {
  author: ObjectId;
  blueprintMedia: File;
  title: string;
  description: string;
  tags: string[];
  options?: PostOptions;
}

/**
 * concept: Posting [Author]
 */
export default class PostingConcept {
  public readonly posts: DocCollection<PostDoc>;

  /**
   * Make an instance of Posting.
   */
  constructor(collectionName: string) {
    this.posts = new DocCollection<PostDoc>(collectionName);
  }

  async create(author: ObjectId, blueprintMedia: File, title: string, description: string, options?: PostOptions) {
    const tags: string[] = [];
    const _id = await this.posts.createOne({ author, blueprintMedia, title, description, tags, options });
    return { msg: "Post successfully created!", post: await this.posts.readOne({ _id }) };
  }

  async getPosts() {
    // Returns all posts! You might want to page for better client performance
    return await this.posts.readMany({}, { sort: { _id: -1 } });
  }

  async getPostById(_id: ObjectId) {
    const post = await this.posts.readOne({ _id });
    if (post === null) {
      throw new NotFoundError(`Post not found!`);
    }
    return post;
  }

  async getByAuthor(author: ObjectId) {
    return await this.posts.readMany({ author });
  }

  async update(_id: ObjectId, blueprintMedia?: File, title?: string, description?: string, tags?: string[], options?: PostOptions) {
    // Note that if content or options is undefined, those fields will *not* be updated
    // since undefined values for partialUpdateOne are ignored.
    await this.posts.partialUpdateOne({ _id }, { blueprintMedia, title, description, tags, options });
    return { msg: "Post successfully updated!" };
  }

  async addTag(_id: ObjectId, tag: string) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError("Post not found!");
    }
    const newTags = post.tags.concat([tag]);
    await this.posts.partialUpdateOne({ _id }, { tags: newTags });
    return { msg: "Tag added" };
  }

  async delete(_id: ObjectId) {
    await this.posts.deleteOne({ _id });
    return { msg: "Post deleted successfully!" };
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    if (post.author.toString() !== user.toString()) {
      throw new PostAuthorNotMatchError(user, _id);
    }
  }
}

export class PostAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of post {1}!", author, _id);
  }
}

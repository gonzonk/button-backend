import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface StitchDoc extends BaseDoc {
  author: ObjectId;
  caption: string;
  content: File;
}

/**
 * concept: Commenting[Parent][Author]
 */
export default class CommentingConcept {
  public readonly stitches: DocCollection<StitchDoc>;

  /**
   * Make an instance of commenting
   */
  constructor(name: string) {
    this.stitches = new DocCollection<StitchDoc>(name);
  }

  async create(author: ObjectId, content: string, parent: ObjectId) {}

  async delete(_id: ObjectId) {}

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {}
}

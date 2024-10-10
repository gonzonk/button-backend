import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface RatingDoc extends BaseDoc {
  parent: ObjectId;
  numberRaters: number;
  averageRating: number;
}

/**
 * concept: Rating[Content]
 */
export default class RatingConcept {
  public readonly ratings: DocCollection<RatingDoc>;

  /**
   * Make a ratings instance
   */
  constructor(name: string) {
    this.ratings = new DocCollection<RatingDoc>(name);
  }

  async getRating(parent: ObjectId) {
    const rating = await this.ratings.readOne({ parent: parent });
    console.log(rating);
    return { msg: "Got Rating", rating: rating };
  }

  async rate(parent: ObjectId, rating: number) {
    const rat = await this.ratings.readOne({ parent: parent });
    if (rat) {
      const newRating = (rat.averageRating * rat.numberRaters) / (rat.numberRaters + 1) + rating / (rat.numberRaters + 1);
      this.ratings.partialUpdateOne({ _id: rat._id }, { numberRaters: rat.numberRaters + 1, averageRating: newRating });
    } else {
      const _id = await this.ratings.createOne({ parent: parent, numberRaters: 1, averageRating: rating });
    }
    return { msg: "Successfully rated!" };
  }
}

import AuthenticatingConcept from "./concepts/authenticating";
import CommentingConcept from "./concepts/commenting";
import FriendingConcept from "./concepts/friending";
import PostingConcept from "./concepts/posting";
import RatingConcept from "./concepts/rating";
import SessioningConcept from "./concepts/sessioning";
import StitchingConcept from "./concepts/stitching";

// The app is a composition of concepts instantiated here
// and synchronized together in `routes.ts`.
export const Sessioning = new SessioningConcept();
export const Authing = new AuthenticatingConcept("users");
export const Posting = new PostingConcept("posts");
export const Friending = new FriendingConcept("friends");
export const Rating = new RatingConcept("ratings");
export const Commenting = new CommentingConcept("comments");
export const Stitching = new StitchingConcept("Stitches");

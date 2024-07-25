import { Currency, Event} from "@prisma/client";

export type FeedEventType = Event & {
  organization: { name: string };
  organizer: { name: string; image: string };
  currency:Currency
};

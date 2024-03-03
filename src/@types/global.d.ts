type Pixel = {
  tokenId: string;
  ownerId: `0x${string}`;

  left: number;
  right: number;
  top: number;
  bottom: number;

  // metadata
  image: string;
  name: string;
  description: string;
  external_url: string;

  lastPrice?: number;
  lastSold?: number;
  recentList?: number;
  price?: number;
  priceExpiration?: number;

  owner: User;
  favorites: Favorite[];
  views: View[];
  orders: OrderData[];
};

type User = {
  address: `0x${string}`;
  banner?: string;
  thumbnail?: string;
  name?: string;
  bio?: string;
};

type Favorite = {
  tokenId: string;
  actorId: `0x${string}`;
};

type View = {
  tokenId: string;
  actorId: `0x${string}`;
};

type OrderCreateData = {
  trader: `0x${string}`;
  side: Side;
  collection: string;
  tokenId: string;
  paymentToken: `0x${string}`;
  price: string;
  listingTime: number;
  expirationTime: number;
  salt: string;
  nonce: string;
  signature: string;
};

type OrderData = {
  id: string;
  trader: `0x${string}`;
  side: Side | string;
  tokenId: string;
  paymentToken: `0x${string}`;
  price: string;
  listingTime: number;
  expirationTime: number;
  salt: string;
  formatted: number;

  // signature
  r: string;
  s: string;
  v: number;

  creator: User;
  pixel: Pixel;
};

type Position = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

type MintRect = Position & Size;

type ConfirmStep = {
  title: string;
  description: string;
};

type Sig = {
  r: string;
  s: string;
  v: number;
};

type MintParam = {
  address: string;
  revealFee: number;
};

type TokenMetadata = {
  image: string;
  metadata: any;
};

type ListMode = "Order" | "Auction";

type SortOption = {
  title: string;
  value: string;
};

type ItemStatus = "list" | "auction" | "offer";

type FilterOption = {
  status?: ItemStatus[];
  price?: {
    from?: number;
    to?: number;
  };
  size?: {
    from?: number;
    to?: number;
  };
};

type HistoryType = "Reveal" | "Transfer" | "Listing" | "Sale";

type FilterType = "Reveal" | "Transfer" | "Listing" | "Sale";

type ItemHistory = {
  id: number | string;
  object?: string;
  type: HistoryType;
  tokenId: number | string;
  fromId: string;
  toId?: string;
  transaction?: string;
  data?: string;
  expirationTime?: number | string;
  createdAt: string;
  updatedAt: string;

  pixel: Pixel;
  from?: User;
  to?: User;
};

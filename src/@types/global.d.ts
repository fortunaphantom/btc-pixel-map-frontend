type Pixel = {
  id: string;
  sat: string;
  ownerId: string;

  left: number;
  right: number;
  top: number;
  bottom: number;
  size: number;

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
  listing?: Listing;
};

type User = {
  address: string;
  banner?: string;
  thumbnail?: string;
  name?: string;
  bio?: string;
};

type Favorite = {
  pixelId: string;
  actorId: string;
};

type View = {
  pixelId: string;
  actorId: string;
};

type Listing = {
  id: string;
  pixelId: string;
  price: Int;
  pricePerPixel: Float;
  createdAt: string;
  expires: string;

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

type HistoryType = "Reveal" | "Transfer" | "Listing" | "Sale" | "Cancel";

type FilterType = "Reveal" | "Transfer" | "Listing" | "Sale" | "Cancel";

type ItemHistory = {
  id: number | string;
  object?: string;
  type: HistoryType;
  pixelId: string;
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

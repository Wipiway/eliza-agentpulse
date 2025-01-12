export interface TokenData {
    id: number;
    address: string;
    name: string;
    ticker?: string;
    description?: string;
    market_cap?: string;
    volume_24h?: string;
    price?: string;
    liquidity?: string;
    supply?: string;
    twitter?: string;
    telegram?: string;
    website?: string;
    launched_at: string;
    creator_address?: string;
    trading?: boolean;
    image?: string;
}

export interface TokenMetrics {
    price_change_24h: number;
    volume_change_24h: number;
    market_cap_change_24h: number;
}

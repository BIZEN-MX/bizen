const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Seeding market_symbols via raw sql...')
    try {
        await prisma.$executeRawUnsafe(`
			INSERT INTO public.market_symbols (symbol, name, type, is_active) VALUES
			('SPY', 'SPDR S&P 500 ETF Trust', 'ETF', true),
			('VOO', 'Vanguard S&P 500 ETF', 'ETF', true),
			('IVV', 'iShares Core S&P 500 ETF', 'ETF', true),
			('QQQ', 'Invesco QQQ Trust', 'ETF', true),
			('DIA', 'SPDR Dow Jones Industrial Average ETF Trust', 'ETF', true),
			('IWM', 'iShares Russell 2000 ETF', 'ETF', true),
			('VTI', 'Vanguard Total Stock Market ETF', 'ETF', true),
			('VT', 'Vanguard Total World Stock ETF', 'ETF', true),
			('SCHD', 'Schwab US Dividend Equity ETF', 'ETF', true),
			('VIG', 'Vanguard Dividend Appreciation ETF', 'ETF', true),
			('ARKK', 'ARK Innovation ETF', 'ETF', true),
			('XLK', 'Technology Select Sector SPDR Fund', 'ETF', true),
			('XLF', 'Financial Select Sector SPDR Fund', 'ETF', true),
			('XLV', 'Health Care Select Sector SPDR Fund', 'ETF', true),
			('XLE', 'Energy Select Sector SPDR Fund', 'ETF', true),
			('XLY', 'Consumer Discretionary Select Sector SPDR Fund', 'ETF', true),
			('XLP', 'Consumer Staples Select Sector SPDR Fund', 'ETF', true),
			('XLI', 'Industrial Select Sector SPDR Fund', 'ETF', true),
			('XLU', 'Utilities Select Sector SPDR Fund', 'ETF', true),
			('GLD', 'SPDR Gold Shares', 'ETF', true),
			('SLV', 'iShares Silver Trust', 'ETF', true),
			('TLT', 'iShares 20+ Year Treasury Bond ETF', 'ETF', true),
			('SHY', 'iShares 1-3 Year Treasury Bond ETF', 'ETF', true),
			('LQD', 'iShares iBoxx $ Investment Grade Corporate Bond ETF', 'ETF', true),
			('HYG', 'iShares iBoxx $ High Yield Corporate Bond ETF', 'ETF', true),
			('AAPL', 'Apple Inc.', 'STOCK', true),
			('MSFT', 'Microsoft Corporation', 'STOCK', true),
			('AMZN', 'Amazon.com, Inc.', 'STOCK', true),
			('GOOGL', 'Alphabet Inc.', 'STOCK', true),
			('META', 'Meta Platforms, Inc.', 'STOCK', true),
			('NVDA', 'NVIDIA Corporation', 'STOCK', true),
			('TSLA', 'Tesla, Inc.', 'STOCK', true),
			('BRK.B', 'Berkshire Hathaway Inc.', 'STOCK', true),
			('JPM', 'JPMorgan Chase & Co.', 'STOCK', true),
			('V', 'Visa Inc.', 'STOCK', true),
			('MA', 'Mastercard Incorporated', 'STOCK', true),
			('UNH', 'UnitedHealth Group Incorporated', 'STOCK', true),
			('JNJ', 'Johnson & Johnson', 'STOCK', true),
			('PG', 'Procter & Gamble Company', 'STOCK', true),
			('XOM', 'Exxon Mobil Corporation', 'STOCK', true),
			('KO', 'Coca-Cola Company', 'STOCK', true),
			('PEP', 'PepsiCo, Inc.', 'STOCK', true),
			('WMT', 'Walmart Inc.', 'STOCK', true),
			('HD', 'Home Depot, Inc.', 'STOCK', true),
			('COST', 'Costco Wholesale Corporation', 'STOCK', true),
			('AVGO', 'Broadcom Inc.', 'STOCK', true),
			('CRM', 'Salesforce, Inc.', 'STOCK', true),
			('NFLX', 'Netflix, Inc.', 'STOCK', true),
			('DIS', 'Walt Disney Company', 'STOCK', true),
			('NKE', 'NIKE, Inc.', 'STOCK', true)
			ON CONFLICT (symbol) DO NOTHING;
        `)
        console.log('✅ Seeded successfully')
    } catch (err) {
        console.error('❌ Insertion failed:', err)
    } finally {
        await prisma.$disconnect()
    }
}

main()

import { AgriculturalRecord } from '../types/agriculture';

export const SAMPLE_AGRICULTURAL_DATA: AgriculturalRecord[] = [
  // Punjab
  { id: 'REC-001', state: 'Punjab', district: 'Ludhiana', crop: 'Wheat', cropYear: 2023, season: 'Rabi', area: 245000, production: 1254400, yield: 5.12 },
  { id: 'REC-002', state: 'Punjab', district: 'Ludhiana', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 258000, production: 1161000, yield: 4.50 },
  { id: 'REC-003', state: 'Punjab', district: 'Amritsar', crop: 'Wheat', cropYear: 2023, season: 'Rabi', area: 188000, production: 940000, yield: 5.00 },
  { id: 'REC-004', state: 'Punjab', district: 'Amritsar', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 182000, production: 782600, yield: 4.30 },
  { id: 'REC-005', state: 'Punjab', district: 'Bathinda', crop: 'Cotton', cropYear: 2023, season: 'Kharif', area: 95000, production: 218500, yield: 2.30 },
  { id: 'REC-006', state: 'Punjab', district: 'Bathinda', crop: 'Wheat', cropYear: 2023, season: 'Rabi', area: 260000, production: 1248000, yield: 4.80 },
  { id: 'REC-007', state: 'Punjab', district: 'Jalandhar', crop: 'Potato', cropYear: 2023, season: 'Rabi', area: 32000, production: 768000, yield: 24.00 },
  { id: 'REC-008', state: 'Punjab', district: 'Ludhiana', crop: 'Wheat', cropYear: 2022, season: 'Rabi', area: 242000, production: 1185800, yield: 4.90 },
  { id: 'REC-009', state: 'Punjab', district: 'Ludhiana', crop: 'Rice', cropYear: 2022, season: 'Kharif', area: 255000, production: 1122000, yield: 4.40 },
  { id: 'REC-010', state: 'Punjab', district: 'Bathinda', crop: 'Cotton', cropYear: 2022, season: 'Kharif', area: 98000, production: 215600, yield: 2.20 },
  { id: 'REC-011', state: 'Punjab', district: 'Ludhiana', crop: 'Wheat', cropYear: 2021, season: 'Rabi', area: 240000, production: 1152000, yield: 4.80 },
  { id: 'REC-012', state: 'Punjab', district: 'Ludhiana', crop: 'Rice', cropYear: 2021, season: 'Kharif', area: 250000, production: 1075000, yield: 4.30 },
  { id: 'REC-013', state: 'Punjab', district: 'Amritsar', crop: 'Wheat', cropYear: 2020, season: 'Rabi', area: 185000, production: 888000, yield: 4.80 },
  { id: 'REC-014', state: 'Punjab', district: 'Ludhiana', crop: 'Maize', cropYear: 2023, season: 'Kharif', area: 42000, production: 168000, yield: 4.00 },

  // Uttar Pradesh
  { id: 'REC-015', state: 'Uttar Pradesh', district: 'Meerut', crop: 'Sugarcane', cropYear: 2023, season: 'Whole Year', area: 135000, production: 9720000, yield: 72.00 },
  { id: 'REC-016', state: 'Uttar Pradesh', district: 'Meerut', crop: 'Wheat', cropYear: 2023, season: 'Rabi', area: 110000, production: 462000, yield: 4.20 },
  { id: 'REC-017', state: 'Uttar Pradesh', district: 'Muzaffarnagar', crop: 'Sugarcane', cropYear: 2023, season: 'Whole Year', area: 165000, production: 12375000, yield: 75.00 },
  { id: 'REC-018', state: 'Uttar Pradesh', district: 'Varanasi', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 85000, production: 263500, yield: 3.10 },
  { id: 'REC-019', state: 'Uttar Pradesh', district: 'Varanasi', crop: 'Wheat', cropYear: 2023, season: 'Rabi', area: 90000, production: 333000, yield: 3.70 },
  { id: 'REC-020', state: 'Uttar Pradesh', district: 'Agra', crop: 'Potato', cropYear: 2023, season: 'Rabi', area: 72000, production: 1728000, yield: 24.00 },
  { id: 'REC-021', state: 'Uttar Pradesh', district: 'Agra', crop: 'Mustard', cropYear: 2023, season: 'Rabi', area: 54000, production: 97200, yield: 1.80 },
  { id: 'REC-022', state: 'Uttar Pradesh', district: 'Bareilly', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 145000, production: 478500, yield: 3.30 },
  { id: 'REC-023', state: 'Uttar Pradesh', district: 'Meerut', crop: 'Sugarcane', cropYear: 2022, season: 'Whole Year', area: 132000, production: 9372000, yield: 71.00 },
  { id: 'REC-024', state: 'Uttar Pradesh', district: 'Meerut', crop: 'Wheat', cropYear: 2022, season: 'Rabi', area: 108000, production: 442800, yield: 4.10 },
  { id: 'REC-025', state: 'Uttar Pradesh', district: 'Varanasi', crop: 'Rice', cropYear: 2022, season: 'Kharif', area: 84000, production: 252000, yield: 3.00 },
  { id: 'REC-026', state: 'Uttar Pradesh', district: 'Gorakhpur', crop: 'Sugarcane', cropYear: 2023, season: 'Whole Year', area: 95000, production: 6460000, yield: 68.00 },
  { id: 'REC-027', state: 'Uttar Pradesh', district: 'Gorakhpur', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 130000, production: 390000, yield: 3.00 },
  { id: 'REC-028', state: 'Uttar Pradesh', district: 'Gorakhpur', crop: 'Pulses', cropYear: 2023, season: 'Rabi', area: 42000, production: 46200, yield: 1.10 },

  // Maharashtra
  { id: 'REC-029', state: 'Maharashtra', district: 'Nashik', crop: 'Sugarcane', cropYear: 2023, season: 'Whole Year', area: 110000, production: 9350000, yield: 85.00 },
  { id: 'REC-030', state: 'Maharashtra', district: 'Nashik', crop: 'Soybean', cropYear: 2023, season: 'Kharif', area: 125000, production: 212500, yield: 1.70 },
  { id: 'REC-031', state: 'Maharashtra', district: 'Nagpur', crop: 'Cotton', cropYear: 2023, season: 'Kharif', area: 140000, production: 252000, yield: 1.80 },
  { id: 'REC-032', state: 'Maharashtra', district: 'Nagpur', crop: 'Soybean', cropYear: 2023, season: 'Kharif', area: 175000, production: 315000, yield: 1.80 },
  { id: 'REC-033', state: 'Maharashtra', district: 'Pune', crop: 'Sugarcane', cropYear: 2023, season: 'Whole Year', area: 120000, production: 10440000, yield: 87.00 },
  { id: 'REC-034', state: 'Maharashtra', district: 'Pune', crop: 'Wheat', cropYear: 2023, season: 'Rabi', area: 65000, production: 195000, yield: 3.00 },
  { id: 'REC-035', state: 'Maharashtra', district: 'Kolhapur', crop: 'Sugarcane', cropYear: 2023, season: 'Whole Year', area: 155000, production: 13950000, yield: 90.00 },
  { id: 'REC-036', state: 'Maharashtra', district: 'Amravati', crop: 'Cotton', cropYear: 2023, season: 'Kharif', area: 190000, production: 323000, yield: 1.70 },
  { id: 'REC-037', state: 'Maharashtra', district: 'Amravati', crop: 'Pulses', cropYear: 2023, season: 'Rabi', area: 68000, production: 61200, yield: 0.90 },
  { id: 'REC-038', state: 'Maharashtra', district: 'Nashik', crop: 'Soybean', cropYear: 2022, season: 'Kharif', area: 120000, production: 192000, yield: 1.60 },
  { id: 'REC-039', state: 'Maharashtra', district: 'Pune', crop: 'Sugarcane', cropYear: 2022, season: 'Whole Year', area: 118000, production: 10030000, yield: 85.00 },
  { id: 'REC-040', state: 'Maharashtra', district: 'Nagpur', crop: 'Cotton', cropYear: 2022, season: 'Kharif', area: 138000, production: 234600, yield: 1.70 },

  // Madhya Pradesh
  { id: 'REC-041', state: 'Madhya Pradesh', district: 'Indore', crop: 'Soybean', cropYear: 2023, season: 'Kharif', area: 210000, production: 420000, yield: 2.00 },
  { id: 'REC-042', state: 'Madhya Pradesh', district: 'Indore', crop: 'Wheat', cropYear: 2023, season: 'Rabi', area: 195000, production: 819000, yield: 4.20 },
  { id: 'REC-043', state: 'Madhya Pradesh', district: 'Ujjain', crop: 'Soybean', cropYear: 2023, season: 'Kharif', area: 230000, production: 460000, yield: 2.00 },
  { id: 'REC-044', state: 'Madhya Pradesh', district: 'Ujjain', crop: 'Wheat', cropYear: 2023, season: 'Rabi', area: 215000, production: 881500, yield: 4.10 },
  { id: 'REC-045', state: 'Madhya Pradesh', district: 'Bhopal', crop: 'Pulses', cropYear: 2023, season: 'Rabi', area: 85000, production: 102000, yield: 1.20 },
  { id: 'REC-046', state: 'Madhya Pradesh', district: 'Jabalpur', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 110000, production: 319000, yield: 2.90 },
  { id: 'REC-047', state: 'Madhya Pradesh', district: 'Indore', crop: 'Soybean', cropYear: 2022, season: 'Kharif', area: 205000, production: 389500, yield: 1.90 },
  { id: 'REC-048', state: 'Madhya Pradesh', district: 'Indore', crop: 'Wheat', cropYear: 2022, season: 'Rabi', area: 190000, production: 760000, yield: 4.00 },
  { id: 'REC-049', state: 'Madhya Pradesh', district: 'Hoshangabad', crop: 'Wheat', cropYear: 2023, season: 'Rabi', area: 280000, production: 1344000, yield: 4.80 },
  { id: 'REC-050', state: 'Madhya Pradesh', district: 'Hoshangabad', crop: 'Soybean', cropYear: 2023, season: 'Kharif', area: 195000, production: 370500, yield: 1.90 },

  // Gujarat
  { id: 'REC-051', state: 'Gujarat', district: 'Rajkot', crop: 'Groundnut', cropYear: 2023, season: 'Kharif', area: 240000, production: 480000, yield: 2.00 },
  { id: 'REC-052', state: 'Gujarat', district: 'Rajkot', crop: 'Cotton', cropYear: 2023, season: 'Kharif', area: 220000, production: 572000, yield: 2.60 },
  { id: 'REC-053', state: 'Gujarat', district: 'Surat', crop: 'Sugarcane', cropYear: 2023, season: 'Whole Year', area: 85000, production: 6970000, yield: 82.00 },
  { id: 'REC-054', state: 'Gujarat', district: 'Surat', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 60000, production: 192000, yield: 3.20 },
  { id: 'REC-055', state: 'Gujarat', district: 'Ahmedabad', crop: 'Wheat', cropYear: 2023, season: 'Rabi', area: 110000, production: 407000, yield: 3.70 },
  { id: 'REC-056', state: 'Gujarat', district: 'Ahmedabad', crop: 'Cotton', cropYear: 2023, season: 'Kharif', area: 130000, production: 312000, yield: 2.40 },
  { id: 'REC-057', state: 'Gujarat', district: 'Banaskantha', crop: 'Mustard', cropYear: 2023, season: 'Rabi', area: 145000, production: 290000, yield: 2.00 },
  { id: 'REC-058', state: 'Gujarat', district: 'Banaskantha', crop: 'Potato', cropYear: 2023, season: 'Rabi', area: 65000, production: 1820000, yield: 28.00 },
  { id: 'REC-059', state: 'Gujarat', district: 'Rajkot', crop: 'Groundnut', cropYear: 2022, season: 'Kharif', area: 235000, production: 446500, yield: 1.90 },
  { id: 'REC-060', state: 'Gujarat', district: 'Rajkot', crop: 'Cotton', cropYear: 2022, season: 'Kharif', area: 215000, production: 537500, yield: 2.50 },

  // West Bengal
  { id: 'REC-061', state: 'West Bengal', district: 'Burdwan', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 310000, production: 1178000, yield: 3.80 },
  { id: 'REC-062', state: 'West Bengal', district: 'Burdwan', crop: 'Rice', cropYear: 2023, season: 'Summer', area: 120000, production: 540000, yield: 4.50 },
  { id: 'REC-063', state: 'West Bengal', district: 'Burdwan', crop: 'Potato', cropYear: 2023, season: 'Rabi', area: 78000, production: 2184000, yield: 28.00 },
  { id: 'REC-064', state: 'West Bengal', district: 'Murshidabad', crop: 'Jute', cropYear: 2023, season: 'Kharif', area: 110000, production: 286000, yield: 2.60 },
  { id: 'REC-065', state: 'West Bengal', district: 'Murshidabad', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 195000, production: 663000, yield: 3.40 },
  { id: 'REC-066', state: 'West Bengal', district: 'Hooghly', crop: 'Potato', cropYear: 2023, season: 'Rabi', area: 92000, production: 2668000, yield: 29.00 },
  { id: 'REC-067', state: 'West Bengal', district: 'Hooghly', crop: 'Jute', cropYear: 2023, season: 'Kharif', area: 65000, production: 175500, yield: 2.70 },
  { id: 'REC-068', state: 'West Bengal', district: 'Darjeeling', crop: 'Tea', cropYear: 2023, season: 'Whole Year', area: 19000, production: 8550, yield: 0.45 },
  { id: 'REC-069', state: 'West Bengal', district: 'Burdwan', crop: 'Rice', cropYear: 2022, season: 'Kharif', area: 305000, production: 1128500, yield: 3.70 },
  { id: 'REC-070', state: 'West Bengal', district: 'Hooghly', crop: 'Potato', cropYear: 2022, season: 'Rabi', area: 90000, production: 2520000, yield: 28.00 },

  // Andhra Pradesh
  { id: 'REC-071', state: 'Andhra Pradesh', district: 'East Godavari', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 220000, production: 924000, yield: 4.20 },
  { id: 'REC-072', state: 'Andhra Pradesh', district: 'East Godavari', crop: 'Rice', cropYear: 2023, season: 'Rabi', area: 140000, production: 672000, yield: 4.80 },
  { id: 'REC-073', state: 'Andhra Pradesh', district: 'Guntur', crop: 'Cotton', cropYear: 2023, season: 'Kharif', area: 170000, production: 425000, yield: 2.50 },
  { id: 'REC-074', state: 'Andhra Pradesh', district: 'Guntur', crop: 'Maize', cropYear: 2023, season: 'Kharif', area: 85000, production: 467500, yield: 5.50 },
  { id: 'REC-075', state: 'Andhra Pradesh', district: 'Anantapur', crop: 'Groundnut', cropYear: 2023, season: 'Kharif', area: 280000, production: 280000, yield: 1.00 },
  { id: 'REC-076', state: 'Andhra Pradesh', district: 'Krishna', crop: 'Sugarcane', cropYear: 2023, season: 'Whole Year', area: 45000, production: 3690000, yield: 82.00 },
  { id: 'REC-077', state: 'Andhra Pradesh', district: 'East Godavari', crop: 'Rice', cropYear: 2022, season: 'Kharif', area: 218000, production: 893800, yield: 4.10 },
  { id: 'REC-078', state: 'Andhra Pradesh', district: 'Guntur', crop: 'Cotton', cropYear: 2022, season: 'Kharif', area: 165000, production: 396000, yield: 2.40 },

  // Karnataka
  { id: 'REC-079', state: 'Karnataka', district: 'Belagavi', crop: 'Sugarcane', cropYear: 2023, season: 'Whole Year', area: 150000, production: 12750000, yield: 85.00 },
  { id: 'REC-080', state: 'Karnataka', district: 'Belagavi', crop: 'Soybean', cropYear: 2023, season: 'Kharif', area: 110000, production: 198000, yield: 1.80 },
  { id: 'REC-081', state: 'Karnataka', district: 'Dharwad', crop: 'Cotton', cropYear: 2023, season: 'Kharif', area: 95000, production: 190000, yield: 2.00 },
  { id: 'REC-082', state: 'Karnataka', district: 'Dharwad', crop: 'Maize', cropYear: 2023, season: 'Kharif', area: 120000, production: 540000, yield: 4.50 },
  { id: 'REC-083', state: 'Karnataka', district: 'Chikkamagaluru', crop: 'Coffee', cropYear: 2023, season: 'Whole Year', area: 68000, production: 64600, yield: 0.95 },
  { id: 'REC-084', state: 'Karnataka', district: 'Shimoga', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 135000, production: 486000, yield: 3.60 },
  { id: 'REC-085', state: 'Karnataka', district: 'Belagavi', crop: 'Sugarcane', cropYear: 2022, season: 'Whole Year', area: 145000, production: 12035000, yield: 83.00 },
  { id: 'REC-086', state: 'Karnataka', district: 'Dharwad', crop: 'Maize', cropYear: 2022, season: 'Kharif', area: 118000, production: 519200, yield: 4.40 },

  // Tamil Nadu
  { id: 'REC-087', state: 'Tamil Nadu', district: 'Thanjavur', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 175000, production: 787500, yield: 4.50 },
  { id: 'REC-088', state: 'Tamil Nadu', district: 'Thanjavur', crop: 'Rice', cropYear: 2023, season: 'Rabi', area: 130000, production: 624000, yield: 4.80 },
  { id: 'REC-089', state: 'Tamil Nadu', district: 'Coimbatore', crop: 'Cotton', cropYear: 2023, season: 'Kharif', area: 42000, production: 92400, yield: 2.20 },
  { id: 'REC-090', state: 'Tamil Nadu', district: 'Coimbatore', crop: 'Maize', cropYear: 2023, season: 'Kharif', area: 58000, production: 290000, yield: 5.00 },
  { id: 'REC-091', state: 'Tamil Nadu', district: 'Cuddalore', crop: 'Sugarcane', cropYear: 2023, season: 'Whole Year', area: 55000, production: 4950000, yield: 90.00 },
  { id: 'REC-092', state: 'Tamil Nadu', district: 'Nilgiris', crop: 'Tea', cropYear: 2023, season: 'Whole Year', area: 52000, production: 78000, yield: 1.50 },
  { id: 'REC-093', state: 'Tamil Nadu', district: 'Thanjavur', crop: 'Rice', cropYear: 2022, season: 'Kharif', area: 170000, production: 748000, yield: 4.40 },

  // Haryana
  { id: 'REC-094', state: 'Haryana', district: 'Karnal', crop: 'Wheat', cropYear: 2023, season: 'Rabi', area: 170000, production: 850000, yield: 5.00 },
  { id: 'REC-095', state: 'Haryana', district: 'Karnal', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 165000, production: 693000, yield: 4.20 },
  { id: 'REC-096', state: 'Haryana', district: 'Hisar', crop: 'Cotton', cropYear: 2023, season: 'Kharif', area: 130000, production: 286000, yield: 2.20 },
  { id: 'REC-097', state: 'Haryana', district: 'Hisar', crop: 'Wheat', cropYear: 2023, season: 'Rabi', area: 210000, production: 987000, yield: 4.70 },
  { id: 'REC-098', state: 'Haryana', district: 'Hisar', crop: 'Mustard', cropYear: 2023, season: 'Rabi', area: 85000, production: 153000, yield: 1.80 },
  { id: 'REC-099', state: 'Haryana', district: 'Karnal', crop: 'Wheat', cropYear: 2022, season: 'Rabi', area: 168000, production: 823200, yield: 4.90 },
  { id: 'REC-100', state: 'Haryana', district: 'Karnal', crop: 'Rice', cropYear: 2022, season: 'Kharif', area: 162000, production: 664200, yield: 4.10 },

  // Rajasthan
  { id: 'REC-101', state: 'Rajasthan', district: 'Sri Ganganagar', crop: 'Wheat', cropYear: 2023, season: 'Rabi', area: 195000, production: 877500, yield: 4.50 },
  { id: 'REC-102', state: 'Rajasthan', district: 'Sri Ganganagar', crop: 'Mustard', cropYear: 2023, season: 'Rabi', area: 140000, production: 252000, yield: 1.80 },
  { id: 'REC-103', state: 'Rajasthan', district: 'Sri Ganganagar', crop: 'Cotton', cropYear: 2023, season: 'Kharif', area: 125000, production: 250000, yield: 2.00 },
  { id: 'REC-104', state: 'Rajasthan', district: 'Jaipur', crop: 'Bajra', cropYear: 2023, season: 'Kharif', area: 180000, production: 288000, yield: 1.60 },
  { id: 'REC-105', state: 'Rajasthan', district: 'Jaipur', crop: 'Mustard', cropYear: 2023, season: 'Rabi', area: 160000, production: 272000, yield: 1.70 },
  { id: 'REC-106', state: 'Rajasthan', district: 'Alwar', crop: 'Mustard', cropYear: 2023, season: 'Rabi', area: 190000, production: 361000, yield: 1.90 },
  { id: 'REC-107', state: 'Rajasthan', district: 'Barmer', crop: 'Bajra', cropYear: 2023, season: 'Kharif', area: 320000, production: 256000, yield: 0.80 },
  { id: 'REC-108', state: 'Rajasthan', district: 'Sri Ganganagar', crop: 'Wheat', cropYear: 2022, season: 'Rabi', area: 190000, production: 836000, yield: 4.40 },

  // Bihar
  { id: 'REC-109', state: 'Bihar', district: 'Patna', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 135000, production: 364500, yield: 2.70 },
  { id: 'REC-110', state: 'Bihar', district: 'Patna', crop: 'Wheat', cropYear: 2023, season: 'Rabi', area: 125000, production: 400000, yield: 3.20 },
  { id: 'REC-111', state: 'Bihar', district: 'Muzaffarpur', crop: 'Maize', cropYear: 2023, season: 'Rabi', area: 95000, production: 522500, yield: 5.50 },
  { id: 'REC-112', state: 'Bihar', district: 'Muzaffarpur', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 110000, production: 308000, yield: 2.80 },
  { id: 'REC-113', state: 'Bihar', district: 'Gaya', crop: 'Pulses', cropYear: 2023, season: 'Rabi', area: 55000, production: 55000, yield: 1.00 },
  { id: 'REC-114', state: 'Bihar', district: 'Patna', crop: 'Rice', cropYear: 2022, season: 'Kharif', area: 130000, production: 338000, yield: 2.60 },

  // Odisha
  { id: 'REC-115', state: 'Odisha', district: 'Cuttack', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 155000, production: 480500, yield: 3.10 },
  { id: 'REC-116', state: 'Odisha', district: 'Cuttack', crop: 'Pulses', cropYear: 2023, season: 'Rabi', area: 48000, production: 43200, yield: 0.90 },
  { id: 'REC-117', state: 'Odisha', district: 'Sambalpur', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 160000, production: 528000, yield: 3.30 },
  { id: 'REC-118', state: 'Odisha', district: 'Sambalpur', crop: 'Rice', cropYear: 2023, season: 'Summer', area: 55000, production: 220000, yield: 4.00 },

  // Kerala
  { id: 'REC-119', state: 'Kerala', district: 'Palakkad', crop: 'Rice', cropYear: 2023, season: 'Kharif', area: 78000, production: 234000, yield: 3.00 },
  { id: 'REC-120', state: 'Kerala', district: 'Palakkad', crop: 'Rice', cropYear: 2023, season: 'Rabi', area: 52000, production: 171600, yield: 3.30 },
  { id: 'REC-121', state: 'Kerala', district: 'Wayanad', crop: 'Coffee', cropYear: 2023, season: 'Whole Year', area: 65000, production: 68250, yield: 1.05 },
  { id: 'REC-122', state: 'Kerala', district: 'Idukki', crop: 'Tea', cropYear: 2023, season: 'Whole Year', area: 38000, production: 57000, yield: 1.50 },

  // Historical Multi-Year Records (2018 - 2021)
  { id: 'REC-123', state: 'Punjab', district: 'Ludhiana', crop: 'Wheat', cropYear: 2019, season: 'Rabi', area: 238000, production: 1118600, yield: 4.70 },
  { id: 'REC-124', state: 'Punjab', district: 'Ludhiana', crop: 'Rice', cropYear: 2019, season: 'Kharif', area: 248000, production: 1041600, yield: 4.20 },
  { id: 'REC-125', state: 'Punjab', district: 'Ludhiana', crop: 'Wheat', cropYear: 2018, season: 'Rabi', area: 235000, production: 1081000, yield: 4.60 },
  { id: 'REC-126', state: 'Punjab', district: 'Ludhiana', crop: 'Rice', cropYear: 2018, season: 'Kharif', area: 245000, production: 1004500, yield: 4.10 },
  { id: 'REC-127', state: 'Uttar Pradesh', district: 'Meerut', crop: 'Sugarcane', cropYear: 2021, season: 'Whole Year', area: 130000, production: 8970000, yield: 69.00 },
  { id: 'REC-128', state: 'Uttar Pradesh', district: 'Meerut', crop: 'Sugarcane', cropYear: 2020, season: 'Whole Year', area: 128000, production: 8704000, yield: 68.00 },
  { id: 'REC-129', state: 'Uttar Pradesh', district: 'Meerut', crop: 'Sugarcane', cropYear: 2019, season: 'Whole Year', area: 125000, production: 8250000, yield: 66.00 },
  { id: 'REC-130', state: 'Uttar Pradesh', district: 'Meerut', crop: 'Sugarcane', cropYear: 2018, season: 'Whole Year', area: 122000, production: 7930000, yield: 65.00 },
  { id: 'REC-131', state: 'Maharashtra', district: 'Nashik', crop: 'Soybean', cropYear: 2020, season: 'Kharif', area: 115000, production: 172500, yield: 1.50 },
  { id: 'REC-132', state: 'Maharashtra', district: 'Nashik', crop: 'Soybean', cropYear: 2019, season: 'Kharif', area: 110000, production: 159500, yield: 1.45 },
  { id: 'REC-133', state: 'Maharashtra', district: 'Nashik', crop: 'Soybean', cropYear: 2018, season: 'Kharif', area: 105000, production: 147000, yield: 1.40 },
  { id: 'REC-134', state: 'Madhya Pradesh', district: 'Indore', crop: 'Soybean', cropYear: 2020, season: 'Kharif', area: 198000, production: 366300, yield: 1.85 },
  { id: 'REC-135', state: 'Madhya Pradesh', district: 'Indore', crop: 'Soybean', cropYear: 2019, season: 'Kharif', area: 190000, production: 342000, yield: 1.80 },
  { id: 'REC-136', state: 'Madhya Pradesh', district: 'Indore', crop: 'Soybean', cropYear: 2018, season: 'Kharif', area: 185000, production: 323750, yield: 1.75 },
  { id: 'REC-137', state: 'Gujarat', district: 'Rajkot', crop: 'Groundnut', cropYear: 2020, season: 'Kharif', area: 228000, production: 410400, yield: 1.80 },
  { id: 'REC-138', state: 'Gujarat', district: 'Rajkot', crop: 'Groundnut', cropYear: 2019, season: 'Kharif', area: 220000, production: 385000, yield: 1.75 },
  { id: 'REC-139', state: 'West Bengal', district: 'Burdwan', crop: 'Rice', cropYear: 2020, season: 'Kharif', area: 298000, production: 1072800, yield: 3.60 },
  { id: 'REC-140', state: 'West Bengal', district: 'Burdwan', crop: 'Rice', cropYear: 2019, season: 'Kharif', area: 290000, production: 1015000, yield: 3.50 },
  { id: 'REC-141', state: 'Tamil Nadu', district: 'Thanjavur', crop: 'Rice', cropYear: 2020, season: 'Kharif', area: 165000, production: 709500, yield: 4.30 },
  { id: 'REC-142', state: 'Tamil Nadu', district: 'Thanjavur', crop: 'Rice', cropYear: 2019, season: 'Kharif', area: 160000, production: 672000, yield: 4.20 },
  { id: 'REC-143', state: 'Haryana', district: 'Hisar', crop: 'Cotton', cropYear: 2020, season: 'Kharif', area: 125000, production: 262500, yield: 2.10 },
  { id: 'REC-144', state: 'Rajasthan', district: 'Sri Ganganagar', crop: 'Wheat', cropYear: 2020, season: 'Rabi', area: 185000, production: 795500, yield: 4.30 },
  { id: 'REC-145', state: 'Punjab', district: 'Ludhiana', crop: 'Wheat', cropYear: 2024, season: 'Rabi', area: 247000, production: 1284400, yield: 5.20 },
  { id: 'REC-146', state: 'Uttar Pradesh', district: 'Meerut', crop: 'Sugarcane', cropYear: 2024, season: 'Whole Year', area: 138000, production: 10212000, yield: 74.00 },
  { id: 'REC-147', state: 'Maharashtra', district: 'Pune', crop: 'Sugarcane', cropYear: 2024, season: 'Whole Year', area: 122000, production: 10736000, yield: 88.00 },
  { id: 'REC-148', state: 'Madhya Pradesh', district: 'Hoshangabad', crop: 'Wheat', cropYear: 2024, season: 'Rabi', area: 285000, production: 1396500, yield: 4.90 },
  { id: 'REC-149', state: 'Gujarat', district: 'Rajkot', crop: 'Cotton', cropYear: 2024, season: 'Kharif', area: 225000, production: 596250, yield: 2.65 },
  { id: 'REC-150', state: 'West Bengal', district: 'Hooghly', crop: 'Potato', cropYear: 2024, season: 'Rabi', area: 94000, production: 2773000, yield: 29.50 }
];

export function getSampleCsvString(): string {
  const headers = 'State,District,Crop,Crop Year,Season,Area,Production,Yield\n';
  const rows = SAMPLE_AGRICULTURAL_DATA.map(
    (r) =>
      `"${r.state}","${r.district}","${r.crop}",${r.cropYear},"${r.season}",${r.area},${r.production},${r.yield}`
  ).join('\n');
  return headers + rows;
}

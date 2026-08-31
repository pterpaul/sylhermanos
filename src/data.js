// Ported from modules/core/database/db.php
// Tries a MySQL/MariaDB connection first (via env vars) for the two
// admin-manageable galleries; falls back to the same folder-scan /
// hardcoded data the PHP site used when no database is configured.
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

let mysqlModule = null;
try {
  // Optional dependency: only needed if DB_HOST etc. are set.
  mysqlModule = require('mysql2/promise');
} catch (e) {
  mysqlModule = null;
}

async function sylDbConnect() {
  if (!mysqlModule || !process.env.DB_HOST) return null;
  try {
    const connection = await mysqlModule.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'sylhermanos',
      charset: 'utf8mb4',
    });
    return connection;
  } catch (e) {
    return null;
  }
}

function listImages(basePath) {
  if (!fs.existsSync(basePath)) return [];
  const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  const files = fs
    .readdirSync(basePath)
    .filter((f) => extensions.includes(path.extname(f).slice(1).toLowerCase()));
  files.sort((a, b) => a.localeCompare(b));
  return files;
}

function loadAboutUsGalleryFromFolder() {
  const basePath = path.join(PUBLIC_DIR, 'assets/library/images/uploads_aboutus');
  const files = listImages(basePath);
  if (!files.length) return [];

  const taglines = {
    SYL_20140709_1431111: "Upholding the corporate values,\nSYL's staff members practice them daily.",
    SYL_20140709_093336: 'Working together with purpose, care, and accountability.',
    SYL_20140709_094100: 'Reliable service begins with people who understand the work.',
    SYL_20140709_1145491: 'Prepared teams and disciplined operations create better outcomes.',
    SYL_20140709_1159221: 'Every movement is handled with care, precision, and pride.',
    SYL_20140709_1536111: 'A customer-first culture guides every interaction.',
    SYL_20140709_143751: 'Strong partnerships are built through consistent service.',
    SYL_20140709_092258: 'From warehouse to customer, we keep brands moving.',
  };

  return files.map((fileName) => {
    const imageKey = fileName.replace(/\.[^.]+$/, '');
    return {
      image: 'assets/library/images/uploads_aboutus/' + fileName,
      title: imageKey,
      alt: 'Syl Hermanos gallery image',
      tagline: taglines[imageKey] || 'A closer look at the people and work behind SYL Hermanos.',
    };
  });
}

async function loadAboutUsGallery() {
  const conn = await sylDbConnect();
  if (conn) {
    try {
      const [rows] = await conn.execute(`
        SELECT g.id, g.title, g.alt_text, g.sort_order, u.file_path
        FROM about_us_gallery g
        INNER JOIN uploads u ON u.id = g.upload_id
        WHERE g.is_active = 1
        ORDER BY g.sort_order ASC, g.id ASC
      `);
      await conn.end();
      const gallery = rows
        .filter((r) => (r.file_path || '').trim() !== '')
        .map((r) => ({
          image: r.file_path.trim(),
          title: r.title || 'Syl Hermanos gallery image',
          alt: r.alt_text || 'Syl Hermanos gallery image',
          tagline: '',
        }));
      if (gallery.length) return gallery;
    } catch (e) {
      // fall through to folder fallback
    }
  }
  return loadAboutUsGalleryFromFolder();
}

/**
 * Why Choose US - Team Gallery (137) - fallback table
 */
function loadTeamGalleryFallback() {
  const basePath = 'assets/library/images/pp/sylpp-layouts/';
  return [
    { image: basePath + 'syl-distribution-operations-a.jpg', department: 'Distribution Operations', tagline: 'Coordinating every movement with care, accuracy, and purpose.', alt: 'SYL distribution operations team' },
    { image: basePath + 'syl-auditors-a.jpeg', department: 'Audit', tagline: 'Providing independent assurance and insight to strengthen operations.', alt: 'SYL audit team' },
    { image: basePath + 'syl-accounting-dept-a.jpeg', department: 'Finance & Accounting', tagline: 'Giving every decision the clarity and accountability it deserves.', alt: 'SYL finance and accounting team' },
    { image: basePath + 'syl-frontdesk-a.jpg', department: 'Front Desk', tagline: 'Creating a welcoming, dependable first connection.', alt: 'SYL front desk team' },
    { image: basePath + 'syl-it-ppaul.jpeg', department: 'Information Technology', tagline: 'Building reliable systems that keep the business moving.', alt: 'SYL information technology team' },
    { image: basePath + 'syl-sales-admin-a.jpeg', department: 'Sales Admin & Accounting', tagline: 'Supporting our sales team with precision and efficiency.', alt: 'SYL sales admin team' },
    { image: basePath + 'syl-hr-interview-a.jpg', department: 'Human Resources', tagline: 'Gives every applicants a opportunity to showcase their potential and fit for the team.', alt: 'SYL human resources team' },
    { image: basePath + 'syl-hr-board-disc-a.jpg', department: 'Human Resources', tagline: 'Nurturing a culture of care, growth, and collaboration for every team member.', alt: 'SYL human resources team' },
    { image: basePath + 'syl-sales-dept-a.jpg', department: 'Sales', tagline: 'Bringing trusted brands closer to every customer.', alt: 'SYL sales team' },
    { image: basePath + 'syl-sales-dept-b.jpg', department: 'Sales - Salesman', tagline: 'Showcasing the best products and services to every customer.', alt: 'SYL sales team' },
    { image: basePath + 'syl-wh-logistics-dept-a.jpg', department: 'Warehouse & Logistics', tagline: 'Delivering precision from storage through to delivery.', alt: 'SYL warehouse and logistics team' },
  ];
}

async function loadTeamGallery() {
  const conn = await sylDbConnect();
  if (conn) {
    try {
      const [rows] = await conn.execute(`
        SELECT tg.id, tg.department, tg.tagline, tg.alt_text, tg.sort_order, u.file_path
        FROM team_gallery tg
        INNER JOIN uploads u ON u.id = tg.upload_id
        WHERE tg.is_active = 1
        ORDER BY tg.sort_order ASC, tg.id ASC
      `);
      await conn.end();
      const gallery = rows
        .filter((r) => (r.file_path || '').trim() !== '')
        .map((r) => {
          const department = (r.department || '').trim() || 'SYL Team';
          return {
            image: r.file_path.trim(),
            department,
            tagline: (r.tagline || '').trim() || 'The people behind the work.',
            alt: (r.alt_text || '').trim() || department + ' team at SYL Hermanos',
          };
        });
      if (gallery.length) return gallery;
    } catch (e) {
      // fall through
    }
  }
  return loadTeamGalleryFallback();
}

function loadPrincipalLogos() {
  const basePath = path.join(PUBLIC_DIR, 'assets/library/images/principals');
  const webPath = 'assets/library/images/principals/';
  const files = listImages(basePath);
  if (!files.length) return [];

  const names = {
    acs: 'ACS',
    centurypacificfood: 'Century Pacific Food',
    delmonte: 'Del Monte',
    goodest: 'Goodest',
    jsu: 'JSU',
    mekeni: 'Mekeni',
    mondenissin: 'Monde Nissin',
    prifood: 'Prifood',
  };

  const featuredOrder = {
    delmonte: 10,
    mondenissin: 20,
    prifood: 30,
    centurypacificfood: 40,
    mekeni: 50,
    goodest: 60,
  };

  const keyOf = (fileName) =>
    fileName.replace(/^syl-principal-/, '').replace(/\.[^.]+$/, '').toLowerCase();

  files.sort((a, b) => {
    const leftKey = keyOf(a);
    const rightKey = keyOf(b);
    const leftRank = featuredOrder[leftKey] ?? 999;
    const rightRank = featuredOrder[rightKey] ?? 999;
    return leftRank === rightRank ? leftKey.localeCompare(rightKey) : leftRank - rightRank;
  });

  return files.map((fileName) => {
    const key = keyOf(fileName);
    return {
      image: webPath + fileName,
      name: names[key] || key.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    };
  });
}

function loadAwardItems() {
  const basePath = path.join(PUBLIC_DIR, 'assets/library/images/awards-reviews/');
  const webPath = 'assets/library/images/awards-reviews/';
  const awards = [
    { slug: 'eagle-distributor-awardee', title: 'Eagle Distributor Awardee', icon: 'fa-trophy' },
    { slug: 'top-performer-distributor', title: 'Top Performer Distributor', icon: 'fa-medal' },
    { slug: 'resilient-performer-distributor', title: 'Resilient Performer Distributor', icon: 'fa-award' },
    { slug: 'distribution-excellence', title: 'Distribution Excellence', icon: 'fa-star' },
  ];

  return awards.map((award) => {
    let imagePath = null;
    for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
      const candidate = `syl-awards-${award.slug}.${ext}`;
      if (fs.existsSync(path.join(basePath, candidate))) {
        imagePath = webPath + candidate;
        break;
      }
    }
    return { ...award, image: imagePath };
  });
}

function loadPrincipalDirectory() {
  return [
    { name: 'Del Monte Philippines, Inc.', logo: 'syl-principal-delmonte.jpg', url: 'https://www.delmontephil.com/', summary: 'A trusted market leader in premium packaged fruit, juices, sauces, pasta, condiments, and fresh produce for Filipino households.' },
    { name: 'Monde Nissin Corporation', logo: 'syl-principal-mondenissin.png', url: 'https://mondenissin.com/', summary: 'A long-standing food company delivering high-quality branded food and beverages, including familiar household favorites across global markets.' },
    { name: 'Prifood Corporation', logo: 'syl-principal-prifood.jpg', url: 'https://www.prifood.com.ph/', summary: 'A Philippine snack-food manufacturer with a diverse range spanning corn chips, baked snacks, coated peanuts, roasted pellets, and wafer products.' },
    { name: 'Century Pacific Food, Inc.', logo: 'syl-principal-centurypacificfood.png', url: 'https://www.centurypacific.com.ph/', summary: 'One of the Philippines’ largest branded food and beverage companies, serving a broad customer base with accessible and nutritious products.' },
    { name: 'Mekeni Food Corporation', logo: 'syl-principal-mekeni.png', url: 'https://www.mekeni.com/', summary: 'A multi-awarded Pampanga food company recognized for quality products distributed throughout the Philippines and selected international markets.' },
    { name: 'ACS', logo: 'syl-principal-acs.jpg', url: 'https://www.acsphilippines.com/', summary: 'A provider of quality household and personal care products created to make everyday life better and easier.' },
    { name: 'JS Unitrade Merchandise, Inc.', logo: 'syl-principal-jsu.jpg', url: 'https://jsunitrade.com/', summary: 'A market leader in best-value fast-moving consumer products focused on enriching family life one product at a time.' },
    { name: 'Goodest Pet Food', logo: 'syl-principal-goodest.png', url: 'https://goodestpetfood.com/', summary: 'A popular, vet-formulated, and budget-friendly Philippine pet-food brand offering complete wet and dry nutrition for cats and dogs.' },
  ];
}

function loadCareerOpenings() {
  return [
    { title: 'Operations Manager', team: 'Operations & Sales', requirements: ['Graduate of any four-year course', 'Experience as an Operations Manager or Team Leader in consumer goods distribution', 'Excellent leadership, communication, and sales-track record'], location: 'Panay & Negros' },
    { title: 'Sales Supervisor', team: 'Operations & Sales', requirements: ['Graduate of any four-year course', 'Experience as a Sales Supervisor in consumer goods distribution', 'Excellent leadership, supervisory, and sales-track record'], location: 'Panay & Negros' },
    { title: 'Van Salesman', team: 'Operations & Sales', requirements: ['At least a two-year course', 'Experience in ex-truck operations or van selling preferred', 'Excellent sales track record and Professional Driving Restriction 1, 2, or 1, 2, 3'], location: 'Panay & Negros' },
    { title: 'Motorcycle Salesman', team: 'Operations & Sales', requirements: ['At least a two-year course', 'Experience in ex-truck operations preferred', 'Excellent sales track record and ability to drive a motorcycle'], location: 'Panay & Negros' },
    { title: 'Delivery Driver', team: 'Operations & Sales', requirements: ['High school graduate or college level', 'Excellent defensive driving skills', 'Professional Driving Restriction 1, 2, 3 or 1, 2, 3, 8'], location: 'Panay & Negros' },
    { title: 'Warehouse Checker', team: 'Operations & Warehouse', requirements: ['Graduate of any four-year course with good academic records', 'Experience in warehousing and inventory management', 'Good analytical and communication skills'], location: 'Panay & Negros' },
    { title: 'Accounting Manager', team: 'Finance & Accounting', requirements: ['Bachelor’s degree in Accountancy; CPA required', 'Knowledge of SAP Business One and 8–10 years of relevant experience', 'Strong leadership, organizational, and communication skills'], location: 'Panay & Negros' },
    { title: 'Accounting Supervisor', team: 'Finance & Accounting', requirements: ['Bachelor’s degree in Accountancy; CPA required', 'Knowledge of SAP Business One and 2–5 years of accounting experience', 'Strong leadership, organizational, and communication skills'], location: 'Panay & Negros' },
    { title: 'Field Auditor', team: 'Operations & Corporate Services', requirements: ['Graduate of a business, computer science, or information systems course', 'Good scholastic record with strong analytical skills', 'Good oral and written communication skills'], location: 'Panay & Negros' },
    { title: 'HR Supervisor', team: 'People & Culture', requirements: ['Graduate of any four-year business course', '2–3 years of experience as an HR Supervisor', 'Knowledge of general HR functions with strong communication and organization skills'], location: 'Panay & Negros' },
    { title: 'HR Specialist', team: 'People & Culture', requirements: ['Graduate of any four-year business course', 'Background in recruitment, employee relations, or compensation and benefits', 'Good academic record with strong communication and organization skills'], location: 'Panay & Negros' },
  ];
}

module.exports = {
  loadAboutUsGallery,
  loadTeamGallery,
  loadPrincipalLogos,
  loadAwardItems,
  loadPrincipalDirectory,
  loadCareerOpenings,
};

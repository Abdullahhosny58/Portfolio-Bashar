// ── CONTENT ────────────────────────────────────────────

export const services = [
  { id: 1, icon: 'camera',   titleKey: 'services.items.0.title', descKey: 'services.items.0.desc' },
  { id: 2, icon: 'aperture', titleKey: 'services.items.1.title', descKey: 'services.items.1.desc' },
  { id: 3, icon: 'film',     titleKey: 'services.items.2.title', descKey: 'services.items.2.desc' },
  { id: 4, icon: 'image',    titleKey: 'services.items.3.title', descKey: 'services.items.3.desc' },
]

// Stills projects — each has an id, bilingual names, cover image, and image array
export const stillsProjects = [
  {
    id: 'after-midnight',
    titleEn: 'After Midnight',
    titleAr: 'بعد منتصف الليل',
    cover: '/images/after-midnight/01.jpg',
    images: Array.from({ length: 13 }, (_, i) => `/images/after-midnight/${String(i + 1).padStart(2, '0')}.jpg`),
  },
  {
    id: 'in-anger',
    titleEn: 'In Anger Coexist',
    titleAr: 'في الغضب تعايش',
    cover: '/images/in-anger/01.jpg',
    images: Array.from({ length: 4 }, (_, i) => `/images/in-anger/${String(i + 1).padStart(2, '0')}.jpg`),
  },
  {
    id: 'photography-minimalism',
    titleEn: 'Photography Minimalism',
    titleAr: 'مينيمالزم',
    cover: '/images/photography-minimalism/01.jpg',
    images: Array.from({ length: 5 }, (_, i) => `/images/photography-minimalism/${String(i + 1).padStart(2, '0')}.jpg`),
  },
]

// Product images grid
export const productImages = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  src: `/images/products/${String(i + 1).padStart(2, '0')}.jpg`,
}))

// Gallery works — stills are project cards, products are individual images
export const works = [
  // Stills projects (shown as cards in stills tab)
  ...stillsProjects.map((p) => ({
    id: `stills-${p.id}`,
    titleEn: p.titleEn,
    titleAr: p.titleAr,
    category: 'stills',
    image: p.cover,
    type: 'project',
    projectId: p.id,
  })),
  // Product images
  ...productImages.map((img) => ({
    id: `product-${img.id}`,
    titleEn: 'Product Photography',
    titleAr: 'تصوير منتجات',
    category: 'products',
    image: img.src,
    type: 'image',
    url: 'https://instagram.com/basharforashoot',
  })),
]

export const stats = [
  { value: '3+',  labelKey: 'about.stats.years_label' },
  { value: '50+', labelKey: 'about.stats.shoots_label' },
  { value: '30+', labelKey: 'about.stats.clients_label' },
]

export const socials = [
  { label: 'Instagram', icon: 'instagram', url: 'https://instagram.com/basharforashoot' },
]

export const workFilters = [
  { key: 'all',      labelKey: 'work.filters.all' },
  { key: 'stills',   labelKey: 'work.filters.stills' },
  { key: 'products', labelKey: 'work.filters.products' },
]

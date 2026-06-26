export type KaluCategoryId = string;

export interface KaluCategory {
  id: KaluCategoryId;
  nombre: string;
  descripcion: string;
}

export interface KaluProduct {
  id: string;
  nombre: string;
  precio: number | null;
  categoriaId: KaluCategoryId;
  categoria: string;
  descripcion: string;
  imagen: string;
  promoCuchareable: boolean;
  consultable: boolean;
  destacado?: boolean;
  stock: number;
  ofertaActiva?: boolean;
  ofertaPrecio?: number | null;
  ofertaFechaFin?: string | null;
}

export interface PickupPoint {
  id: string;
  nombre: string;
  direccion: string;
  mapa: string;
}

const dessertImage = 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=85';
const cakeImage = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85';
const sweetsImage = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85';

export const officialWhatsapp = '51912888898';

export const pickupPoints: PickupPoint[] = [
  {
    id: 'precio-uno-tinguina',
    nombre: 'Afuera de Precio Uno de La Tinguiña',
    direccion: 'Av. Río de Janeiro, La Tinguiña, Ica',
    mapa: 'https://maps.app.goo.gl/NdaZuumg6QH935JcA',
  },
  {
    id: 'oechsle-ica',
    nombre: 'Afuera de Oechsle de Ica',
    direccion: 'Av. San Martín, Ica',
    mapa: 'https://maps.app.goo.gl/ra5o9BsMx8XWgdJQ7',
  },
];

export const kaluCategories: KaluCategory[] = [
  { id: 'cuchareables', nombre: 'Cuchareables', descripcion: 'Postres personales listos para disfrutar en Ica.' },
  { id: 'tortas-cuarto', nombre: 'Tortas 1/4 kg', descripcion: 'Porciones generosas y combinaciones dúo.' },
  { id: 'tortas-kilo', nombre: 'Tortas 1 kg', descripcion: 'Tortas enteras y combinadas para compartir.' },
  { id: 'personalizadas', nombre: 'Tortas personalizadas', descripcion: 'Diseños para eventos, cumpleaños y celebraciones.' },
  { id: 'bocaditos', nombre: 'Bocaditos', descripcion: 'Dulces pequeños para acompañar cualquier momento.' },
  { id: 'kekes', nombre: 'Kekes', descripcion: 'Kekes caseros de pecana, plátano y sabores de temporada.' },
];

const cuchareableNames = [
  'Torta de Chocolate con Fudge Casero',
  'Torta Sublime con Maní',
  'Cheesecake de Maracuyá',
  'Carrot Cake',
  'Tres Leches',
  'Torta de Chocoteja con Pecanas',
];

function product(id: string, nombre: string, precio: number | null, categoriaId: KaluCategoryId, descripcion: string, options?: Partial<KaluProduct>): KaluProduct {
  const categoria = kaluCategories.find((item) => item.id === categoriaId)?.nombre ?? 'Kalú';
  return {
    id,
    nombre,
    precio,
    categoriaId,
    categoria,
    descripcion,
    imagen: categoriaId === 'bocaditos' || categoriaId === 'kekes' ? sweetsImage : categoriaId === 'personalizadas' ? cakeImage : dessertImage,
    promoCuchareable: categoriaId === 'cuchareables' && cuchareableNames.includes(nombre),
    consultable: precio === null,
    stock: 8,
    ofertaActiva: false,
    ofertaPrecio: null,
    ofertaFechaFin: null,
    ...options,
  };
}

export const kaluProducts: KaluProduct[] = [
  product('cuch-chocolate-fudge', 'Torta de Chocolate con Fudge Casero', 7, 'cuchareables', 'Cuchareable de chocolate intenso con fudge casero.'),
  product('cuch-sublime-mani', 'Torta Sublime con Maní', 7, 'cuchareables', 'Cuchareable inspirado en Sublime, con maní y crema suave.'),
  product('cuch-cheesecake-maracuya', 'Cheesecake de Maracuyá', 7, 'cuchareables', 'Cheesecake cremoso con maracuyá fresco.'),
  product('cuch-carrot-cake', 'Carrot Cake', 7, 'cuchareables', 'Bizcocho especiado de zanahoria con cobertura cremosa.'),
  product('cuch-tres-leches', 'Tres Leches', 7, 'cuchareables', 'Clásico tres leches húmedo y delicado.'),
  product('cuch-chocoteja-pecanas', 'Torta de Chocoteja con Pecanas', 7, 'cuchareables', 'Chocolate, manjar y pecanas en formato cuchareable.'),
  product('cuch-pistacho', 'Torta de Pistacho', 8, 'cuchareables', 'Cuchareable premium de pistacho. No aplica a la promo.', { stock: 3 }),

  product('cuarto-chocolate-fudge', 'Torta de Chocolate con Fudge Casero', 12, 'tortas-cuarto', 'Torta 1/4 kg de chocolate con fudge casero.'),
  product('cuarto-sublime-mani', 'Torta Sublime con Maní', 12, 'tortas-cuarto', 'Torta 1/4 kg con chocolate y maní.'),
  product('cuarto-cheesecake-maracuya', 'Cheesecake de Maracuyá', 12, 'tortas-cuarto', 'Torta 1/4 kg con maracuyá natural.'),
  product('cuarto-carrot-cake', 'Carrot Cake', 12, 'tortas-cuarto', 'Torta 1/4 kg de carrot cake.'),
  product('cuarto-tres-leches', 'Tres Leches', 12, 'tortas-cuarto', 'Torta 1/4 kg tres leches.'),
  product('cuarto-pistacho', 'Torta de Pistacho', 12, 'tortas-cuarto', 'Torta 1/4 kg sabor pistacho.', { stock: 0 }),
  product('cuarto-chocoteja-pecanas', 'Torta de Chocoteja con Pecanas', 12, 'tortas-cuarto', 'Torta 1/4 kg con pecanas.'),
  product('cuarto-duo-chocolate-sublime', 'Torta de Chocolate con Fudge Casero + Torta Sublime con Maní', 12, 'tortas-cuarto', 'Combinación dúo en 1/4 kg.'),
  product('cuarto-duo-chocolate-chocoteja', 'Torta de Chocolate con Fudge Casero + Torta de Chocoteja con Pecanas', 12, 'tortas-cuarto', 'Combinación dúo en 1/4 kg.'),
  product('cuarto-duo-chocolate-cheesecake', 'Torta de Chocolate con Fudge Casero + Cheesecake de Maracuyá', 12, 'tortas-cuarto', 'Combinación dúo en 1/4 kg.'),
  product('cuarto-duo-chocolate-tres-leches', 'Torta de Chocolate con Fudge Casero + Tres Leches', 12, 'tortas-cuarto', 'Combinación dúo en 1/4 kg.'),

  product('kilo-chocolate-fudge', 'Torta de Chocolate con Fudge Casero', 28, 'tortas-kilo', 'Torta 1 kg de chocolate con fudge casero.'),
  product('kilo-tres-leches', 'Tres Leches', 28, 'tortas-kilo', 'Torta 1 kg tres leches.'),
  product('kilo-chocoteja-pecanas', 'Torta de Chocoteja con Pecanas', 28, 'tortas-kilo', 'Torta 1 kg con pecanas.'),
  product('kilo-combo-chocolate-tres-leches', 'Torta de Chocolate con Fudge Casero + Tres Leches', 30, 'tortas-kilo', 'Torta 1 kg combinada.'),
  product('kilo-combo-chocolate-cheesecake', 'Torta de Chocolate con Fudge Casero + Cheesecake de Maracuyá', 30, 'tortas-kilo', 'Torta 1 kg combinada.'),
  product('kilo-combo-chocolate-chocoteja', 'Torta de Chocolate con Fudge Casero + Torta de Chocoteja con Pecanas', 30, 'tortas-kilo', 'Torta 1 kg combinada.'),
  product('kilo-combo-triple', 'Torta de Chocolate con Fudge Casero + Tres Leches + Cheesecake de Maracuyá', 30, 'tortas-kilo', 'Torta 1 kg combinada de tres sabores.'),
  product('kilo-combo-cuatro', 'Torta de Chocolate con Fudge Casero + Tres Leches + Cheesecake de Maracuyá + Torta de Chocoteja con Pecanas', 30, 'tortas-kilo', 'Torta 1 kg combinada de cuatro sabores.'),

  product('personalizadas-eventos', 'Tortas Personalizadas para Eventos', null, 'personalizadas', 'Diseños especiales para cumpleaños, bautizos, baby shower, aniversarios, graduaciones, temáticas infantiles, eventos corporativos y diseños personalizados. Precio según diseño, tamaño y decoración.'),

  product('boc-alfajores-maicena', 'Alfajores de Maicena', 2.5, 'bocaditos', 'Alfajor suave de maicena con relleno dulce.'),
  product('boc-pye-manzana', 'Pye de Manzana', 4.5, 'bocaditos', 'Pye casero con manzana especiada.'),
  product('boc-keke-pecana', 'Keke de Pecana', 3, 'kekes', 'Keke individual con pecanas.'),
  product('boc-keke-platano', 'Keke de Plátano', 3, 'kekes', 'Keke casero de plátano.'),
];

export function getProductById(id: string) {
  return kaluProducts.find((item) => item.id === id) ?? null;
}

export function getProductsByCategory(categoryId: KaluCategoryId) {
  return kaluProducts.filter((item) => item.categoriaId === categoryId);
}

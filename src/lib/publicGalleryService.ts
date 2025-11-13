import api from './api';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  is_active: boolean;
  gallery_posts?: GalleryPost[];
  created_at: string;
  updated_at: string;
}

export interface GalleryPost {
  id: number;
  category_id: number;
  created_by: number;
  title: string;
  description: string;
  image_path: string;
  image_thumbnail?: string;
  image_medium?: string;
  image_width?: number;
  image_height?: number;
  file_size?: number;
  media_type: 'image' | 'video';
  video_path?: string;
  video_thumbnail?: string;
  video_duration?: number;
  views_count: number;
  is_published: boolean;
  published_at?: string;
  category?: Category;
  creator?: any;
  image_url?: string;
  thumbnail_url?: string;
  medium_url?: string;
  video_url?: string;
  video_thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

interface GalleryResponse {
  success: boolean;
  posts?: {
    data: GalleryPost[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  post?: GalleryPost;
  categories?: Category[];
  category?: Category;
}

class PublicGalleryService {
  /**
   * Obtener todas las categorías activas
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<GalleryResponse>('/gallery/categories');
      return response.data.categories || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener categorías');
    }
  }

  /**
   * Obtener categoría por ID
   */
  async getCategory(id: number): Promise<Category> {
    try {
      const response = await api.get<GalleryResponse>(`/gallery/categories/${id}`);
      return response.data.category!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener categoría');
    }
  }

  /**
   * Obtener publicaciones (solo publicadas)
   */
  async getPosts(params?: {
    category_id?: number;
    per_page?: number;
    page?: number;
  }): Promise<GalleryResponse['posts']> {
    try {
      const response = await api.get<GalleryResponse>('/gallery/posts', { params });
      return response.data.posts;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener publicaciones');
    }
  }

  /**
   * Obtener publicación específica
   */
  async getPost(id: number): Promise<GalleryPost> {
    try {
      const response = await api.get<GalleryResponse>(`/gallery/posts/${id}`);
      return response.data.post!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener publicación');
    }
  }

  /**
   * Obtener publicaciones por categoría (slug)
   */
  async getPostsByCategory(slug: string, params?: {
    per_page?: number;
    page?: number;
  }): Promise<GalleryResponse['posts']> {
    try {
      const response = await api.get<GalleryResponse>(`/gallery/category/${slug}`, { params });
      return response.data.posts;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener publicaciones');
    }
  }
}

export const publicGalleryService = new PublicGalleryService();

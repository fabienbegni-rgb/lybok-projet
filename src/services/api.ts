// =====================================================
// SERVICE API - Couche d'abstraction pour la base SQL
// =====================================================
// Ce service peut être connecté à n'importe quel backend
// (Node.js/Express, PHP/Laravel, Python/Django, etc.)

// Déclaration pour les variables d'environnement Vite
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// Types pour la base de données
export interface DBMember {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: 'admin' | 'tresorier' | 'membre';
  is_active: boolean;
  created_at: string;
}

export interface DBCagnote {
  id: number;
  month: string;
  year: number;
  target_amount: number;
  collected_amount: number;
  subscription_amount: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  deadline?: string;
}

export interface DBContribution {
  id: number;
  member_id: number;
  cagnote_id: number;
  amount: number;
  payment_method: string;
  payment_reference?: string;
  status: 'pending' | 'processing' |'paid' | 'failed' | 'refunded';
  payment_date?: string;
}

export interface DBMessage {
  id: number;
  member_id: number;
  content: string;
  message_type: 'message' | 'info' | 'alert';
  created_at: string;
}

export interface DBAnnouncement {
  id: number;
  title: string;
  content: string;
  author_id: number;
  priority: 'normal' | 'important' | 'urgent';
  is_active: boolean;
  created_at: string;
}

export interface DBAidRequest {
  id: number;
  member_id: number;
  category: string;
  description: string;
  requested_amount: number;
  approved_amount?: number;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'paid';
  created_at: string;
}

// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Classe pour gérer les erreurs API
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Fonction utilitaire pour les requêtes
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `Erreur API: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Erreur de connexion au serveur');
  }
}

// =====================================================
// SERVICE DES MEMBRES
// =====================================================
export const MembersService = {
  // Récupérer tous les membres
  async getAll(): Promise<DBMember[]> {
    return fetchApi<DBMember[]>('/members');
  },

  // Récupérer un membre par ID
  async getById(id: number): Promise<DBMember> {
    return fetchApi<DBMember>(`/members/${id}`);
  },

  // Créer un nouveau membre
  async create(data: Omit<DBMember, 'id' | 'created_at'>): Promise<DBMember> {
    return fetchApi<DBMember>('/members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Mettre à jour un membre
  async update(id: number, data: Partial<DBMember>): Promise<DBMember> {
    return fetchApi<DBMember>(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Supprimer un membre
  async delete(id: number): Promise<void> {
    await fetchApi(`/members/${id}`, { method: 'DELETE' });
  },

  // Récupérer les statistiques d'un membre
  async getStats(id: number): Promise<{
    total_contributions: number;
    total_paid: number;
    last_payment_date: string | null;
  }> {
    return fetchApi(`/members/${id}/stats`);
  },
};

// =====================================================
// SERVICE DES CAGNOTTES
// =====================================================
export const CagnotesService = {
  // Récupérer toutes les cagnottes
  async getAll(): Promise<DBCagnote[]> {
    return fetchApi<DBCagnote[]>('/cagnotes');
  },

  // Récupérer la cagnote active
  async getActive(): Promise<DBCagnote | null> {
    try {
      return await fetchApi<DBCagnote>('/cagnotes/active');
    } catch {
      return null;
    }
  },

  // Créer une nouvelle cagnote
  async create(data: Omit<DBCagnote, 'id' | 'collected_amount'>): Promise<DBCagnote> {
    return fetchApi<DBCagnote>('/cagnotes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Mettre à jour le montant collecté
  async updateCollectedAmount(id: number, amount: number): Promise<DBCagnote> {
    return fetchApi<DBCagnote>(`/cagnotes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ collected_amount: amount }),
    });
  },

  // Récupérer les statistiques
  async getStats(): Promise<{
    total_collected: number;
    total_target: number;
    completion_percentage: number;
    members_paid: number;
    total_members: number;
  }> {
    return fetchApi('/cagnotes/stats');
  },
};

// =====================================================
// SERVICE DES COTISATIONS
// =====================================================
export const ContributionsService = {
  // Récupérer toutes les cotisations
  async getAll(filters?: {
    member_id?: number;
    cagnote_id?: number;
    status?: string;
  }): Promise<DBContribution[]> {
    const params = new URLSearchParams();
    if (filters?.member_id) params.append('member_id', filters.member_id.toString());
    if (filters?.cagnote_id) params.append('cagnote_id', filters.cagnote_id.toString());
    if (filters?.status) params.append('status', filters.status);
    
    return fetchApi<DBContribution[]>(`/contributions?${params.toString()}`);
  },

  // Récupérer les cotisations d'un membre
  async getByMember(memberId: number): Promise<DBContribution[]> {
    return fetchApi<DBContribution[]>(`/contributions/member/${memberId}`);
  },

  // Créer une nouvelle cotisation
  async create(data: {
    member_id: number;
    cagnote_id: number;
    amount: number;
    payment_method: string;
    payment_reference?: string;
  }): Promise<DBContribution> {
    return fetchApi<DBContribution>('/contributions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Mettre à jour le statut d'une cotisation
  async updateStatus(
    id: number,
    status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'
  ): Promise<DBContribution> {
    return fetchApi<DBContribution>(`/contributions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, payment_date: status === 'paid' ? new Date().toISOString() : undefined }),
    });
  },

  // Récupérer les statistiques des cotisations
  async getStats(cagnoteId?: number): Promise<{
    total_paid: number;
    total_pending: number;
    count_paid: number;
    count_pending: number;
    count_late: number;
  }> {
    const params = cagnoteId ? `?cagnote_id=${cagnoteId}` : '';
    return fetchApi(`/contributions/stats${params}`);
  },
};

// =====================================================
// SERVICE DES MESSAGES
// =====================================================
export const MessagesService = {
  // Récupérer tous les messages
  async getAll(limit?: number): Promise<DBMessage[]> {
    const params = limit ? `?limit=${limit}` : '';
    return fetchApi<DBMessage[]>(`/messages${params}`);
  },

  // Récupérer les messages récents
  async getRecent(since: string): Promise<DBMessage[]> {
    return fetchApi<DBMessage[]>(`/messages/recent?since=${since}`);
  },

  // Envoyer un message
  async send(data: {
    member_id: number;
    content: string;
    message_type?: 'message' | 'info' | 'alert';
  }): Promise<DBMessage> {
    return fetchApi<DBMessage>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Supprimer un message
  async delete(id: number): Promise<void> {
    await fetchApi(`/messages/${id}`, { method: 'DELETE' });
  },
};

// =====================================================
// SERVICE DES ANNONCES
// =====================================================
export const AnnouncementsService = {
  // Récupérer toutes les annonces actives
  async getAll(): Promise<DBAnnouncement[]> {
    return fetchApi<DBAnnouncement[]>('/announcements');
  },

  // Créer une annonce
  async create(data: {
    title: string;
    content: string;
    author_id: number;
    priority?: 'normal' | 'important' | 'urgent';
  }): Promise<DBAnnouncement> {
    return fetchApi<DBAnnouncement>('/announcements', {
      method: 'POST',
      body: JSON.stringify({ ...data, is_active: true }),
    });
  },

  // Désactiver une annonce
  async deactivate(id: number): Promise<void> {
    await fetchApi(`/announcements/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: false }),
    });
  },
};

// =====================================================
// SERVICE DES AIDES SOCIALES
// =====================================================
export const AidRequestsService = {
  // Récupérer toutes les demandes
  async getAll(filters?: {
    status?: string;
    member_id?: number;
  }): Promise<DBAidRequest[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.member_id) params.append('member_id', filters.member_id.toString());
    
    return fetchApi<DBAidRequest[]>(`/aid-requests?${params.toString()}`);
  },

  // Créer une demande d'aide
  async create(data: {
    member_id: number;
    category: string;
    description: string;
    requested_amount: number;
  }): Promise<DBAidRequest> {
    return fetchApi<DBAidRequest>('/aid-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Approuver une demande
  async approve(
    id: number,
    data: {
      approved_amount: number;
      reviewed_by: number;
      review_notes?: string;
    }
  ): Promise<DBAidRequest> {
    return fetchApi<DBAidRequest>(`/aid-requests/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Rejeter une demande
  async reject(
    id: number,
    data: {
      reviewed_by: number;
      review_notes: string;
    }
  ): Promise<DBAidRequest> {
    return fetchApi<DBAidRequest>(`/aid-requests/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Marquer comme payé
  async markAsPaid(id: number): Promise<DBAidRequest> {
    return fetchApi<DBAidRequest>(`/aid-requests/${id}/pay`, {
      method: 'PATCH',
    });
  },

  // Récupérer les statistiques
  async getStats(): Promise<{
    total_requests: number;
    approved: number;
    pending: number;
    total_amount_approved: number;
  }> {
    return fetchApi('/aid-requests/stats');
  },
};

// =====================================================
// SERVICE DES NOTIFICATIONS
// =====================================================
export const NotificationsService = {
  // Récupérer les notifications d'un membre
  async getByMember(memberId: number, unreadOnly?: boolean): Promise<any[]> {
    const params = unreadOnly ? '?unread=true' : '';
    return fetchApi(`/notifications/member/${memberId}${params}`);
  },

  // Marquer comme lu
  async markAsRead(id: number): Promise<void> {
    await fetchApi(`/notifications/${id}/read`, { method: 'PATCH' });
  },

  // Marquer toutes comme lues
  async markAllAsRead(memberId: number): Promise<void> {
    await fetchApi(`/notifications/member/${memberId}/read-all`, { method: 'PATCH' });
  },

  // Compter les non-lues
  async countUnread(memberId: number): Promise<number> {
    const result = await fetchApi<{ count: number }>(`/notifications/member/${memberId}/count`);
    return result.count;
  },
};

// Export par défaut
export default {
  Members: MembersService,
  Cagnotes: CagnotesService,
  Contributions: ContributionsService,
  Messages: MessagesService,
  Announcements: AnnouncementsService,
  AidRequests: AidRequestsService,
  Notifications: NotificationsService,
};

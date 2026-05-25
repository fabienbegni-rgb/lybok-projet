import { useState, useEffect, useCallback } from 'react';
import {
  MembersService,
  CagnotesService,
  ContributionsService,
  MessagesService,
  AnnouncementsService,
  AidRequestsService,
} from '../services/api';
import type { DBMember, DBCagnote, DBContribution, DBMessage, DBAnnouncement, DBAidRequest } from '../services/api';

// =====================================================
// HOOK POUR LA GESTION DES DONNÉES
// =====================================================
// Ce hook peut être connecté à une vraie base SQL
// ou utiliser les données mock en mode démo

interface DatabaseState {
  // Données
  members: DBMember[];
  cagnotes: DBCagnote[];
  activeCagnote: DBCagnote | null;
  contributions: DBContribution[];
  messages: DBMessage[];
  announcements: DBAnnouncement[];
  aidRequests: DBAidRequest[];
  
  // Membre actuel
  currentMember: DBMember | null;
  
  // États de chargement
  isLoading: {
    members: boolean;
    cagnotes: boolean;
    contributions: boolean;
    messages: boolean;
    announcements: boolean;
    aidRequests: boolean;
  };
  
  // Erreurs
  errors: Record<string, string | null>;
}

export function useDatabase(memberId: number = 1) {
  const [state, setState] = useState<DatabaseState>({
    members: [],
    cagnotes: [],
    activeCagnote: null,
    contributions: [],
    messages: [],
    announcements: [],
    aidRequests: [],
    currentMember: null,
    isLoading: {
      members: false,
      cagnotes: false,
      contributions: false,
      messages: false,
      announcements: false,
      aidRequests: false,
    },
    errors: {},
  });

  // Mode démo (utilise les données mock)
  const [isDemoMode, setIsDemoMode] = useState(true);

  // =====================================================
  // CHARGEMENT DES DONNÉES
  // =====================================================
  
  const loadMembers = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: { ...prev.isLoading, members: true } }));
    try {
      if (isDemoMode) {
        // Mode dépo: utiliser les données mock
        const { members } = await import('../mockData');
        const mappedMembers: DBMember[] = members.map(m => ({
          id: parseInt(m.id),
          name: m.name,
          email: m.email,
          avatar: m.avatar,
          role: m.role,
          is_active: true,
          created_at: m.joinDate,
        }));
        setState(prev => ({
          ...prev,
          members: mappedMembers,
          currentMember: mappedMembers.find(m => m.id === memberId) || null,
        }));
      } else {
        const members = await MembersService.getAll();
        const currentMember = members.find(m => m.id === memberId) || null;
        setState(prev => ({ ...prev, members, currentMember }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, members: 'Erreur lors du chargement des membres' },
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: { ...prev.isLoading, members: false } }));
    }
  }, [memberId, isDemoMode]);

  const loadCagnotes = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: { ...prev.isLoading, cagnotes: true } }));
    try {
      if (isDemoMode) {
        const { cagnotes } = await import('../mockData');
        setState(prev => ({
          ...prev,
          cagnotes: cagnotes as any,
          activeCagnote: cagnotes.find(c => c.status === 'active') as any,
        }));
      } else {
        const cagnotes = await CagnotesService.getAll();
        const activeCagnote = cagnotes.find(c => c.status === 'active') || null;
        setState(prev => ({ ...prev, cagnotes, activeCagnote }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, cagnotes: 'Erreur lors du chargement des cagnotes' },
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: { ...prev.isLoading, cagnotes: false } }));
    }
  }, [isDemoMode]);

  const loadContributions = useCallback(async (filters?: { member_id?: number; cagnote_id?: number }) => {
    setState(prev => ({ ...prev, isLoading: { ...prev.isLoading, contributions: true } }));
    try {
      if (isDemoMode) {
        const { contributions } = await import('../mockData');
        setState(prev => ({ ...prev, contributions: contributions as any }));
      } else {
        const contributions = await ContributionsService.getAll(filters);
        setState(prev => ({ ...prev, contributions }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, contributions: 'Erreur lors du chargement des cotisations' },
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: { ...prev.isLoading, contributions: false } }));
    }
  }, [isDemoMode]);

  const loadMessages = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: { ...prev.isLoading, messages: true } }));
    try {
      if (isDemoMode) {
        const { initialMessages } = await import('../mockData');
        setState(prev => ({ ...prev, messages: initialMessages as any }));
      } else {
        const messages = await MessagesService.getAll(50);
        setState(prev => ({ ...prev, messages }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, messages: 'Erreur lors du chargement des messages' },
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: { ...prev.isLoading, messages: false } }));
    }
  }, [isDemoMode]);

  const loadAnnouncements = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: { ...prev.isLoading, announcements: true } }));
    try {
      if (isDemoMode) {
        const { announcements } = await import('../mockData');
        setState(prev => ({ ...prev, announcements: announcements as any }));
      } else {
        const announcements = await AnnouncementsService.getAll();
        setState(prev => ({ ...prev, announcements }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, announcements: 'Erreur lors du chargement des annonces' },
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: { ...prev.isLoading, announcements: false } }));
    }
  }, [isDemoMode]);

  const loadAidRequests = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: { ...prev.isLoading, aidRequests: true } }));
    try {
      if (isDemoMode) {
        // Mode démo: données vides
        setState(prev => ({ ...prev, aidRequests: [] }));
      } else {
        const aidRequests = await AidRequestsService.getAll();
        setState(prev => ({ ...prev, aidRequests }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, aidRequests: 'Erreur lors du chargement des demandes d\'aide' },
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: { ...prev.isLoading, aidRequests: false } }));
    }
  }, [isDemoMode]);

  // =====================================================
  // ACTIONS
  // =====================================================

  const sendMessage = useCallback(async (content: string, type: 'message' | 'info' | 'alert' = 'message') => {
    if (isDemoMode) {
      // Mode dépo: ajouter localement
      const newMessage: DBMessage = {
        id: Date.now(),
        member_id: memberId,
        content,
        message_type: type,
        created_at: new Date().toISOString(),
      };
      setState(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
    } else {
      try {
        await MessagesService.send({
          member_id: memberId,
          content,
          message_type: type,
        });
        await loadMessages();
      } catch (error) {
        throw error;
      }
    }
  }, [memberId, isDemoMode, loadMessages]);

  const createContribution = useCallback(async (data: {
    cagnote_id: number;
    amount: number;
    payment_method: string;
  }) => {
    if (isDemoMode) {
      // Mode dépo: ajouter localement
      const newContribution: DBContribution = {
        id: Date.now(),
        member_id: memberId,
        cagnote_id: data.cagnote_id,
        amount: data.amount,
        payment_method: data.payment_method,
        status: 'paid',
        payment_date: new Date().toISOString(),
      };
      setState(prev => ({ ...prev, contributions: [...prev.contributions, newContribution] }));
    } else {
      try {
        await ContributionsService.create({
          member_id: memberId,
          ...data,
        });
        await loadContributions();
        await loadCagnotes();
      } catch (error) {
        throw error;
      }
    }
  }, [memberId, isDemoMode, loadContributions, loadCagnotes]);

  const createAidRequest = useCallback(async (data: {
    category: string;
    description: string;
    requested_amount: number;
  }) => {
    if (isDemoMode) {
      const newRequest: DBAidRequest = {
        id: Date.now(),
        member_id: memberId,
        ...data,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      setState(prev => ({ ...prev, aidRequests: [...prev.aidRequests, newRequest] }));
    } else {
      try {
        await AidRequestsService.create({
          member_id: memberId,
          ...data,
        });
        await loadAidRequests();
      } catch (error) {
        throw error;
      }
    }
  }, [memberId, isDemoMode, loadAidRequests]);

  // =====================================================
  // CHARGEMENT INITIAL
  // =====================================================

  useEffect(() => {
    loadMembers();
    loadCagnotes();
    loadAnnouncements();
  }, [loadMembers, loadCagnotes, loadAnnouncements]);

  // =====================================================
  // RETOUR
  // =====================================================

  return {
    ...state,
    isDemoMode,
    setIsDemoMode,
    // Actions de chargement
    loadMembers,
    loadCagnotes,
    loadContributions,
    loadMessages,
    loadAnnouncements,
    loadAidRequests,
    // Actions métier
    sendMessage,
    createContribution,
    createAidRequest,
  };
}

export default useDatabase;

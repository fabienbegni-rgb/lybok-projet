import { User, Message, Contribution, Cagnote, Announcement } from './types';

export const currentUser: User = {
  id: '1',
  name: 'Amadou Diallo',
  email: 'amadou.diallo@email.com',
  avatar: '👨🏿‍💼',
  role: 'admin',
  joinDate: '2020-01-15',
  activityDomain: 'Gestion de projet',
  city: 'Bokito',
};

export const members: User[] = [
  currentUser,
  { id: '2', name: 'Fatoumata Keita', email: 'fatoumata@email.com', avatar: '👩🏿', role: 'membre', joinDate: '2020-03-20', activityDomain: 'Commerce', city: 'Yaoundé' },
  { id: '3', name: 'Ibrahim Touré', email: 'ibrahim@email.com', avatar: '👨🏿‍🏫', role: 'membre', joinDate: '2020-05-10', activityDomain: 'Enseignement', city: 'Douala' },
  { id: '4', name: 'Aïssatou Bah', email: 'aissatou@email.com', avatar: '👩🏿‍🎓', role: 'membre', joinDate: '2020-07-25', activityDomain: 'Étudiante', city: 'Bokito' },
  { id: '5', name: 'Moussa Condé', email: 'moussa@email.com', avatar: '👨🏿‍💻', role: 'membre', joinDate: '2021-01-05', activityDomain: 'Informatique', city: 'Yaoundé' },
  { id: '6', name: 'Mariam Sylla', email: 'mariam@email.com', avatar: '👩🏿‍🔬', role: 'membre', joinDate: '2021-04-18', activityDomain: 'Santé', city: 'Douala' },
  { id: '7', name: 'Ousmane Camara', email: 'ousmane@email.com', avatar: '👨🏿‍⚕️', role: 'membre', joinDate: '2021-08-12', activityDomain: 'Santé', city: 'Bokito' },
  { id: '8', name: 'Kadiatou Diallo', email: 'kadiatou@email.com', avatar: '👩🏿‍🎨', role: 'membre', joinDate: '2022-01-20', activityDomain: 'Artisanat', city: 'Yaoundé' },
];

export const initialMessages: Message[] = [
  { id: '1', userId: '2', userName: 'Fatoumata Keita', content: 'Bienvenue à tous dans notre groupe de tontine ! 🎉', timestamp: new Date('2024-01-15T10:30:00'), type: 'message' },
  { id: '2', userId: '3', userName: 'Ibrahim Touré', content: 'Merci Fatoumata ! On est ravis de participer à cette belle initiative solidaire.', timestamp: new Date('2024-01-15T10:35:00'), type: 'message' },
  { id: '3', userId: '1', userName: 'Amadou Diallo', content: '📢 Rappel : La cotisation de janvier est de 25 000 FCFA. Merci de régulariser avant le 25.', timestamp: new Date('2024-01-15T11:00:00'), type: 'info' },
  { id: '4', userId: '4', userName: 'Aïssatou Bah', content: "J'ai effectué mon paiement ce matin ! 🙌", timestamp: new Date('2024-01-16T09:15:00'), type: 'message' },
  { id: '5', userId: '5', userName: 'Moussa Condé', content: 'Excellente nouvelle ! Merci à tous pour votre ponctualité.', timestamp: new Date('2024-01-16T09:30:00'), type: 'message' },
];

export const contributions: Contribution[] = [
  { id: '1', userId: '1', userName: 'Amadou Diallo', amount: 25000, month: 'Janvier', year: 2024, status: 'paid', paymentDate: '2024-01-10' },
  { id: '2', userId: '2', userName: 'Fatoumata Keita', amount: 25000, month: 'Janvier', year: 2024, status: 'paid', paymentDate: '2024-01-12' },
  { id: '3', userId: '3', userName: 'Ibrahim Touré', amount: 25000, month: 'Janvier', year: 2024, status: 'pending' },
  { id: '4', userId: '4', userName: 'Aïssatou Bah', amount: 25000, month: 'Janvier', year: 2024, status: 'paid', paymentDate: '2024-01-16' },
  { id: '5', userId: '5', userName: 'Moussa Condé', amount: 25000, month: 'Janvier', year: 2024, status: 'paid', paymentDate: '2024-01-14' },
  { id: '6', userId: '6', userName: 'Mariam Sylla', amount: 25000, month: 'Janvier', year: 2024, status: 'late' },
  { id: '7', userId: '7', userName: 'Ousmane Camara', amount: 25000, month: 'Janvier', year: 2024, status: 'paid', paymentDate: '2024-01-18' },
  { id: '8', userId: '8', userName: 'Kadiatou Diallo', amount: 25000, month: 'Janvier', year: 2024, status: 'paid', paymentDate: '2024-01-11' },
  { id: '9', userId: '1', userName: 'Amadou Diallo', amount: 25000, month: 'Décembre', year: 2023, status: 'paid', paymentDate: '2023-12-08' },
  { id: '10', userId: '2', userName: 'Fatoumata Keita', amount: 25000, month: 'Décembre', year: 2023, status: 'paid', paymentDate: '2023-12-10' },
];

export const cagnotes: Cagnote[] = [
  { id: '1', month: 'Janvier', year: 2024, targetAmount: 200000, collectedAmount: 150000, membersCount: 8, status: 'active' },
  { id: '2', month: 'Février', year: 2024, targetAmount: 200000, collectedAmount: 0, membersCount: 0, status: 'upcoming' },
  { id: '3', month: 'Décembre', year: 2023, targetAmount: 200000, collectedAmount: 200000, membersCount: 8, status: 'completed' },
  { id: '4', month: 'Novembre', year: 2023, targetAmount: 200000, collectedAmount: 175000, membersCount: 7, status: 'completed' },
];

export const announcements: Announcement[] = [
  { 
    id: '1', 
    title: 'Nouvelle aide pour les étudiants', 
    content: 'Grâce à vos contributions de décembre et ceux du GUIDE, nous avons pu aider 5 étudiants avec leurs frais de scolarité. Merci pour votre générosité !',
    author: 'Amadou Diallo',
    date: '2024-01-05',
    priority: 'important'
  },
  { 
    id: '2', 
    title: 'Assemblée générale annuelle', 
    content: "L'AG se tiendra le 28 janvier à 15h. Tous les membres sont invités à participer.",
    author: 'Amadou Diallo',
    date: '2024-01-02',
    priority: 'normal'
  },
  { 
    id: '3', 
    title: 'Rappel cotisation', 
    content: 'La cotisation de janvier est due avant le 25. Pensez à effectuer votre virement.',
    author: 'Amadou Diallo',
    date: '2024-01-10',
    priority: 'urgent'
  }
];

export const socialAids = [
  { id: '1', beneficiary: 'Mohamed Camara', amount: 50000, reason: 'Frais médicaux', date: '2023-12-20', status: 'approved' },
  { id: '2', beneficiary: 'Étudiants de 2ème année', amount: 100000, reason: 'Frais de scolarité', date: '2023-12-15', status: 'approved' },
  { id: '3', beneficiary: 'Fatima Bah', amount: 30000, reason: 'Urgence familiale', date: '2023-11-10', status: 'approved' },
];

import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventItem, Registration, UserProfile, Speaker, Sponsor } from '../types';
import { MOCK_EVENTS, MOCK_REGISTRATIONS, DEMO_USERS, MOCK_SPEAKERS, MOCK_SPONSORS } from '../data/mockData';
import { generateRegistrationNumber } from '../lib/utils';

interface AppContextType {
  events: EventItem[];
  registrations: Registration[];
  speakers: Speaker[];
  sponsors: Sponsor[];
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  registeredUserEmail: string | null;
  setRegisteredUserEmail: (email: string | null) => void;
  registeredUserName: string | null;
  setRegisteredUserName: (name: string | null) => void;
  getEventBySlug: (slug: string) => EventItem | undefined;
  getEventById: (id: string) => EventItem | undefined;
  getRegistrationByNumber: (regNumber: string) => Registration | undefined;
  addRegistration: (reg: Omit<Registration, 'id' | 'registration_number' | 'created_at'>) => Registration;
  checkInAttendee: (regNumber: string) => { success: boolean; message: string; registration?: Registration };
  addEvent: (event: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>) => EventItem;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  toggleEventPublish: (id: string) => void;
  toggleEventFeatured: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_EVENTS = 'cib_ghana_events_v2';
const STORAGE_KEY_REGS = 'cib_ghana_registrations_v1';
const STORAGE_KEY_USER = 'cib_ghana_current_user_v1';
const STORAGE_KEY_REG_EMAIL = 'cib_ghana_registered_email_v1';
const STORAGE_KEY_REG_NAME = 'cib_ghana_registered_name_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_EVENTS;
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_REGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_REGISTRATIONS;
  });

  const [speakers] = useState<Speaker[]>(MOCK_SPEAKERS);
  const [sponsors] = useState<Sponsor[]>(MOCK_SPONSORS);

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEMO_USERS[0]; // default to SUPER_ADMIN for rich evaluation
  });

  const [registeredUserEmail, setRegisteredUserEmailState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_REG_EMAIL) || null;
  });

  const setRegisteredUserEmail = (email: string | null) => {
    setRegisteredUserEmailState(email);
    if (email) {
      localStorage.setItem(STORAGE_KEY_REG_EMAIL, email);
    } else {
      localStorage.removeItem(STORAGE_KEY_REG_EMAIL);
    }
  };

  const [registeredUserName, setRegisteredUserNameState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_REG_NAME) || null;
  });

  const setRegisteredUserName = (name: string | null) => {
    setRegisteredUserNameState(name);
    if (name) {
      localStorage.setItem(STORAGE_KEY_REG_NAME, name);
    } else {
      localStorage.removeItem(STORAGE_KEY_REG_NAME);
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REGS, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  const getEventBySlug = (slug: string) => events.find((e) => e.slug === slug);
  const getEventById = (id: string) => events.find((e) => e.id === id);
  const getRegistrationByNumber = (regNumber: string) => 
    registrations.find((r) => r.registration_number.toUpperCase() === regNumber.trim().toUpperCase());

  const addRegistration = (regData: Omit<Registration, 'id' | 'registration_number' | 'created_at'>): Registration => {
    const newReg: Registration = {
      ...regData,
      id: `reg-${Date.now()}`,
      registration_number: generateRegistrationNumber(),
      created_at: new Date().toISOString(),
    };

    setRegistrations((prev) => [newReg, ...prev]);

    // increment event registered count
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === regData.event_id) {
          const newCount = evt.registered_count + 1;
          return {
            ...evt,
            registered_count: newCount,
            status: newCount >= evt.capacity ? 'REGISTRATION_CLOSED' : evt.status,
          };
        }
        return evt;
      })
    );

    return newReg;
  };

  const checkInAttendee = (regNumber: string) => {
    const cleanNumber = regNumber.trim().toUpperCase();
    const regIndex = registrations.findIndex((r) => r.registration_number.toUpperCase() === cleanNumber);

    if (regIndex === -1) {
      return { success: false, message: `Registration number "${cleanNumber}" was not found in the system.` };
    }

    const reg = registrations[regIndex];
    if (reg.check_in_status === 'CHECKED_IN') {
      return {
        success: false,
        message: `Already Checked In! Attendee ${reg.first_name} ${reg.last_name} checked in at ${reg.check_in_time ? new Date(reg.check_in_time).toLocaleTimeString() : 'earlier'}.`,
        registration: reg,
      };
    }

    const updatedReg: Registration = {
      ...reg,
      check_in_status: 'CHECKED_IN',
      check_in_time: new Date().toISOString(),
    };

    const updatedList = [...registrations];
    updatedList[regIndex] = updatedReg;
    setRegistrations(updatedList);

    return {
      success: true,
      message: `Checked In Successfully! Welcome, ${reg.first_name} ${reg.last_name}.`,
      registration: updatedReg,
    };
  };

  const addEvent = (eventData: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>): EventItem => {
    const newEvent: EventItem = {
      ...eventData,
      id: `evt-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleEventPublish = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const nextStatus = e.status === 'DRAFT' ? 'OPEN_FOR_REGISTRATION' : 'DRAFT';
          return { ...e, status: nextStatus, updated_at: new Date().toISOString() };
        }
        return e;
      })
    );
  };

  const toggleEventFeatured = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_featured: !e.is_featured, updated_at: new Date().toISOString() } : e))
    );
  };

  return (
    <AppContext.Provider
      value={{
        events,
        registrations,
        speakers,
        sponsors,
        currentUser,
        setCurrentUser,
        registeredUserEmail,
        setRegisteredUserEmail,
        registeredUserName,
        setRegisteredUserName,
        getEventBySlug,
        getEventById,
        getRegistrationByNumber,
        addRegistration,
        checkInAttendee,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleEventPublish,
        toggleEventFeatured,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

'use client'

import { useEffect, useState } from 'react'

export type StoryCharacter = { id: string; name: string; role: string; color: string; status: 'active' | 'missing' | 'dead' | 'inactive'; bio: string; tags: string[] }

export const defaultCharacters: StoryCharacter[] = [
  { id: 'redparasite', name: 'RedParasite', role: 'Crew Leader', color: '#ef4444', status: 'active', bio: 'Story protagonist and crew leader.', tags: ['leader'] },
  { id: 'aj', name: 'AJ', role: 'Associate', color: '#3b82f6', status: 'active', bio: 'Trusted associate.', tags: ['friend'] },
  { id: 'chitty', name: 'Chitty', role: 'Crew Member', color: '#60a5fa', status: 'active', bio: 'Crew member.', tags: ['crew'] },
  { id: 'sanju', name: 'Sanju', role: 'Crew Member', color: '#10b981', status: 'active', bio: 'Part of the main storyline.', tags: ['crew'] },
  { id: 'pr-hashtag', name: 'PR Hashtag', role: 'Contact', color: '#facc15', status: 'active', bio: 'Story contact.', tags: ['contact'] },
  { id: 'obito', name: 'Obito', role: 'Rival', color: '#8b5cf6', status: 'active', bio: 'A dangerous rival.', tags: ['rival'] },
  { id: 'gabbar', name: 'Gabbar Singh', role: 'Antagonist', color: '#f97316', status: 'active', bio: 'Antagonist.', tags: ['enemy'] },
  { id: 'krishna', name: 'Krishna', role: 'Associate', color: '#06b6d4', status: 'active', bio: 'Story associate.', tags: ['friend'] },
]

const KEY = 'nande_story_characters_v2'

export function getCharacters(): StoryCharacter[] {
  if (typeof window === 'undefined') return defaultCharacters
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : defaultCharacters } catch { return defaultCharacters }
}

export function saveCharacters(characters: StoryCharacter[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(characters))
  window.dispatchEvent(new CustomEvent('nande-characters-updated'))
}

export function useCharacterCatalog() {
  const [characters, setCharacters] = useState<StoryCharacter[]>(defaultCharacters)
  useEffect(() => {
    const refresh = () => setCharacters(getCharacters())
    refresh()
    window.addEventListener('nande-characters-updated', refresh)
    return () => window.removeEventListener('nande-characters-updated', refresh)
  }, [])
  return characters
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      entities: {
        Row: {
          created_at: string
          description: string | null
          id: number
          parent: number | null
          rating: number | null
          trip_id: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          parent?: number | null
          rating?: number | null
          trip_id?: number | null
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          parent?: number | null
          rating?: number | null
          trip_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entities_parent_fkey"
            columns: ["parent"]
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entities_trip_id_fkey"
            columns: ["trip_id"]
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entities_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      groups: {
        Row: {
          id: number
          trip_id: number
          user_id: string
        }
        Insert: {
          id?: number
          trip_id: number
          user_id?: string
        }
        Update: {
          id?: number
          trip_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_trip_id_fkey"
            columns: ["trip_id"]
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      lodgings: {
        Row: {
          address: string | null
          created_at: string
          end_date: string | null
          id: number
          name: string
          price: number | null
          start_date: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          end_date?: string | null
          id: number
          name: string
          price?: number | null
          start_date?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          end_date?: string | null
          id?: number
          name?: string
          price?: number | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lodgings_id_fkey"
            columns: ["id"]
            referencedRelation: "entities"
            referencedColumns: ["id"]
          }
        ]
      }
      photos: {
        Row: {
          created_at: string
          entity_id: number
          id: string
        }
        Insert: {
          created_at?: string
          entity_id: number
          id: string
        }
        Update: {
          created_at?: string
          entity_id?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_entity_id_fkey"
            columns: ["entity_id"]
            referencedRelation: "entities"
            referencedColumns: ["id"]
          }
        ]
      }
      places: {
        Row: {
          address: string | null
          created_at: string
          date: string | null
          id: number
          name: string
          price: number | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          date?: string | null
          id: number
          name: string
          price?: number | null
        }
        Update: {
          address?: string | null
          created_at?: string
          date?: string | null
          id?: number
          name?: string
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "places_id_fkey"
            columns: ["id"]
            referencedRelation: "entities"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          displayed: string
          id: string
          photo: string | null
          username: string
        }
        Insert: {
          displayed: string
          id: string
          photo?: string | null
          username: string
        }
        Update: {
          displayed?: string
          id?: string
          photo?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transports: {
        Row: {
          arrival_datetime: string | null
          arrival_place: string | null
          created_at: string
          departure_datetime: string | null
          departure_place: string | null
          id: number
          mean: string | null
          price: number | null
        }
        Insert: {
          arrival_datetime?: string | null
          arrival_place?: string | null
          created_at?: string
          departure_datetime?: string | null
          departure_place?: string | null
          id: number
          mean?: string | null
          price?: number | null
        }
        Update: {
          arrival_datetime?: string | null
          arrival_place?: string | null
          created_at?: string
          departure_datetime?: string | null
          departure_place?: string | null
          id?: number
          mean?: string | null
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transports_id_fkey"
            columns: ["id"]
            referencedRelation: "entities"
            referencedColumns: ["id"]
          }
        ]
      }
      trips: {
        Row: {
          destination: string
          end_date: string | null
          id: number
          photo: string | null
          start_date: string | null
        }
        Insert: {
          destination: string
          end_date?: string | null
          id: number
          photo?: string | null
          start_date?: string | null
        }
        Update: {
          destination?: string
          end_date?: string | null
          id?: number
          photo?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_id_fkey"
            columns: ["id"]
            referencedRelation: "entities"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_access: {
        Args: {
          userid: string
          tripid: number
        }
        Returns: boolean
      }
      is_owner: {
        Args: {
          userid: string
          tripid: number
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      entities: {
        Row: {
          created_at: string
          description: string | null
          id: number
          maps_id: string | null
          parent: number | null
          rating: number | null
          thumbnail: string | null
          trip_id: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          maps_id?: string | null
          parent?: number | null
          rating?: number | null
          thumbnail?: string | null
          trip_id?: number | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          maps_id?: string | null
          parent?: number | null
          rating?: number | null
          thumbnail?: string | null
          trip_id?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entities_parent_fkey"
            columns: ["parent"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entities_thumbnail_fkey"
            columns: ["thumbnail"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entities_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          address: string | null
          created_at: string
          date: string | null
          id: number
          name: string | null
          price: number | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          date?: string | null
          id?: number
          name?: string | null
          price?: number | null
        }
        Update: {
          address?: string | null
          created_at?: string
          date?: string | null
          id?: number
          name?: string | null
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_foods_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          accepted: boolean
          id: number
          trip_id: number
          user_id: string
        }
        Insert: {
          accepted?: boolean
          id?: number
          trip_id: number
          user_id?: string
        }
        Update: {
          accepted?: boolean
          id?: number
          trip_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          created_at: string
          entity_id: number
          id: string
          is_favourite: boolean
          is_thumbnail: boolean
          latitude: string | null
          longitude: string | null
          name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          entity_id: number
          id: string
          is_favourite?: boolean
          is_thumbnail?: boolean
          latitude?: string | null
          longitude?: string | null
          name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: number
          id?: string
          is_favourite?: boolean
          is_thumbnail?: boolean
          latitude?: string | null
          longitude?: string | null
          name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photos_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
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
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transports: {
        Row: {
          arrival_datetime: string | null
          arrival_place: string
          created_at: string
          departure_datetime: string | null
          departure_place: string
          id: number
          mean: string | null
          price: number | null
        }
        Insert: {
          arrival_datetime?: string | null
          arrival_place: string
          created_at?: string
          departure_datetime?: string | null
          departure_place: string
          id: number
          mean?: string | null
          price?: number | null
        }
        Update: {
          arrival_datetime?: string | null
          arrival_place?: string
          created_at?: string
          departure_datetime?: string | null
          departure_place?: string
          id?: number
          mean?: string | null
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transports_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          currency: string | null
          currency_ratio: number | null
          destination: string
          end_date: string | null
          id: number
          start_date: string | null
        }
        Insert: {
          currency?: string | null
          currency_ratio?: number | null
          destination: string
          end_date?: string | null
          id: number
          start_date?: string | null
        }
        Update: {
          currency?: string | null
          currency_ratio?: number | null
          destination?: string
          end_date?: string | null
          id?: number
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_all: {
        Args: {
          tripid?: number
          parentid?: number
        }
        Returns: {
          id: number
          description: string
          rating: number
          main_id: number
          parent: number
          photo: string
          created_at: string
          maps_id: string
          trip_destination: string
          trip_start: string
          trip_end: string
          trip_currency: string
          trip_currency_ratio: number
          place_name: string
          place_date: string
          place_address: string
          place_price: number
          lodging_name: string
          lodging_address: string
          lodging_price: number
          lodging_start: string
          lodging_end: string
          transport_price: number
          transport_departure: string
          transport_arrival: string
          transport_mean: string
          transport_departure_place: string
          transport_arrival_place: string
          food_price: number
          food_date: string
          food_name: string
          food_address: string
        }[]
      }
      get_single: {
        Args: {
          entityid: number
        }
        Returns: {
          id: number
          description: string
          rating: number
          main_id: number
          parent: number
          photo: string
          created_at: string
          maps_id: string
          trip_destination: string
          trip_start: string
          trip_end: string
          trip_currency: string
          trip_currency_ratio: number
          place_name: string
          place_date: string
          place_address: string
          place_price: number
          lodging_name: string
          lodging_address: string
          lodging_price: number
          lodging_start: string
          lodging_end: string
          transport_price: number
          transport_departure: string
          transport_arrival: string
          transport_mean: string
          transport_departure_place: string
          transport_arrival_place: string
          food_price: number
          food_date: string
          food_name: string
          food_address: string
        }[]
      }
      get_trip_info: {
        Args: {
          _trip_id: number
        }
        Returns: {
          total_cost: number
          place_cost: number
          food_cost: number
          transport_cost: number
          lodging_cost: number
          num_trips: number
          num_places: number
          num_foods: number
          num_transports: number
          num_lodgings: number
          num_photos: number
          favourite_photos: string[]
        }[]
      }
      get_tripid: {
        Args: {
          _id: number
        }
        Returns: number
      }
      has_access: {
        Args: {
          userid: string
          tripid: number
        }
        Returns: boolean
      }
      has_access_no_accepted: {
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
      move: {
        Args: {
          moveid: number
          tripid: number
        }
        Returns: undefined
      }
      tripid_or_id: {
        Args: {
          trip_id: number
          id: number
        }
        Returns: number
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

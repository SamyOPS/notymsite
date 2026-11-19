// Types de la base Supabase (schéma public), générés depuis le projet
// Notym_site. À régénérer après chaque migration :
// `npx supabase gen types typescript --project-id jzrpfbdkarjcawndrltt`.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Permet à createClient de choisir les bonnes options pour cette version de PostgREST.
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          content: string;
          cover_alt: string;
          cover_url: string | null;
          created_at: string;
          excerpt: string;
          id: string;
          published: boolean;
          published_at: string | null;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          content?: string;
          cover_alt?: string;
          cover_url?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          cover_alt?: string;
          cover_url?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      brands: {
        Row: {
          created_at: string;
          id: string;
          logo_url: string | null;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          logo_url?: string | null;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          logo_url?: string | null;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          name: string;
          parent_id: string | null;
          slug: string;
          sort: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string;
          id?: string;
          name: string;
          parent_id?: string | null;
          slug: string;
          sort?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          name?: string;
          parent_id?: string | null;
          slug?: string;
          sort?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          brand_id: string | null;
          category_id: string;
          created_at: string;
          description: string | null;
          featured: boolean;
          id: string;
          images: string[];
          in_stock: boolean | null;
          is_best_seller: boolean;
          is_new: boolean;
          is_promo: boolean;
          legacy_id: number | null;
          name: string;
          pack_label: string;
          popularity: number;
          price_from_ht_cents: number | null;
          published: boolean;
          sku: string | null;
          slug: string;
          units_per_pack: number | null;
          updated_at: string;
          volume: string | null;
        };
        Insert: {
          brand_id?: string | null;
          category_id: string;
          created_at?: string;
          description?: string | null;
          featured?: boolean;
          id?: string;
          images?: string[];
          in_stock?: boolean | null;
          is_best_seller?: boolean;
          is_new?: boolean;
          is_promo?: boolean;
          legacy_id?: number | null;
          name: string;
          pack_label: string;
          popularity?: number;
          price_from_ht_cents?: number | null;
          published?: boolean;
          sku?: string | null;
          slug: string;
          units_per_pack?: number | null;
          updated_at?: string;
          volume?: string | null;
        };
        Update: {
          brand_id?: string | null;
          category_id?: string;
          created_at?: string;
          description?: string | null;
          featured?: boolean;
          id?: string;
          images?: string[];
          in_stock?: boolean | null;
          is_best_seller?: boolean;
          is_new?: boolean;
          is_promo?: boolean;
          legacy_id?: number | null;
          name?: string;
          pack_label?: string;
          popularity?: number;
          price_from_ht_cents?: number | null;
          published?: boolean;
          sku?: string | null;
          slug?: string;
          units_per_pack?: number | null;
          updated_at?: string;
          volume?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      requests: {
        Row: {
          company_name: string;
          contact_name: string;
          created_at: string;
          details: Json;
          email: string;
          id: string;
          lines: Json;
          notes: string;
          phone: string;
          received_at: string;
          reference: string;
          status: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          company_name: string;
          contact_name: string;
          created_at?: string;
          details: Json;
          email: string;
          id?: string;
          lines?: Json;
          notes?: string;
          phone: string;
          received_at?: string;
          reference: string;
          status?: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          company_name?: string;
          contact_name?: string;
          created_at?: string;
          details?: Json;
          email?: string;
          id?: string;
          lines?: Json;
          notes?: string;
          phone?: string;
          received_at?: string;
          reference?: string;
          status?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];

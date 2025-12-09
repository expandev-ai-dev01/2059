/**
 * @summary
 * In-memory store instance for ContactForm entity.
 * Provides singleton pattern for data storage without database.
 *
 * @module instances/contactForm/contactFormStore
 */

/**
 * ContactForm record structure
 */
export interface ContactFormRecord {
  id: number;
  tipo_pessoa: 'Física' | 'Jurídica';
  nome_completo: string;
  email: string;
  telefone: string;
  cpf: string | null;
  cnpj: string | null;
  razao_social: string | null;
  area_juridica: string;
  descricao_necessidade: string;
  nivel_urgencia: 'Baixa' | 'Média' | 'Alta' | 'Emergencial';
  preferencia_contato: 'Telefone' | 'Email' | 'WhatsApp' | 'Presencial';
  horario_preferencial: 'Manhã (8h-12h)' | 'Tarde (12h-18h)' | 'Noite (18h-20h)';
  aceite_termos: boolean;
  aceite_newsletter: boolean;
  data_submissao: string;
  ip_usuario: string;
  origem: string;
  protocolo: string;
}

/**
 * In-memory store for ContactForm records
 */
class ContactFormStore {
  private records: Map<number, ContactFormRecord> = new Map();
  private currentId: number = 0;

  /**
   * Get next available ID
   */
  getNextId(): number {
    this.currentId += 1;
    return this.currentId;
  }

  /**
   * Get all records
   */
  getAll(): ContactFormRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get record by ID
   */
  getById(id: number): ContactFormRecord | undefined {
    return this.records.get(id);
  }

  /**
   * Get record by protocol
   */
  getByProtocol(protocol: string): ContactFormRecord | undefined {
    return Array.from(this.records.values()).find((r) => r.protocolo === protocol);
  }

  /**
   * Add new record
   */
  add(record: ContactFormRecord): ContactFormRecord {
    this.records.set(record.id, record);
    return record;
  }

  /**
   * Get records by urgency level
   */
  getByUrgency(urgency: string): ContactFormRecord[] {
    return Array.from(this.records.values()).filter((r) => r.nivel_urgencia === urgency);
  }

  /**
   * Get records by legal area
   */
  getByLegalArea(area: string): ContactFormRecord[] {
    return Array.from(this.records.values()).filter((r) => r.area_juridica === area);
  }

  /**
   * Get total count of records
   */
  count(): number {
    return this.records.size;
  }

  /**
   * Clear all records (useful for testing)
   */
  clear(): void {
    this.records.clear();
    this.currentId = 0;
  }
}

/**
 * Singleton instance of ContactFormStore
 */
export const contactFormStore = new ContactFormStore();

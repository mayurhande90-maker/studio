
import { TypedEmitter } from 'tiny-typed-emitter';

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

interface ErrorEvents {
  'permission-error': (error: FirestorePermissionError) => void;
}

/**
 * A type-safe event emitter for handling global application errors.
 * Currently, it only handles Firestore permission errors.
 */
export const errorEmitter = new TypedEmitter<ErrorEvents>();

/**
 * A custom error class for Firestore permission errors.
 * It includes additional context to help debug security rule violations.
 */
export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `FirestoreError: Missing or insufficient permissions. The following request was denied by Firestore Security Rules:\n${JSON.stringify(context, null, 2)}`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
  }
}

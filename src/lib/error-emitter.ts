import { TypedEmitter } from 'tiny-typed-emitter';
import type { DocumentReference, DocumentData } from 'firebase/firestore';

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
  // The Firestore operation that was attempted (e.g., 'get', 'add', 'update', 'delete').
  operation: 'get' | 'add' | 'update' | 'delete';

  // The Firestore reference of the document that was being accessed.
  ref: DocumentReference;

  // The data that was being sent to Firestore with the request.
  resource?: DocumentData;

  constructor(
    message: string,
    operation: 'get' | 'add' | 'update' | 'delete',
    ref: DocumentReference,
    resource?: DocumentData
  ) {
    super(message);
    this.name = 'FirestorePermissionError';
    this.operation = operation;
    this.ref = ref;
    this.resource = resource;
  }
}

import _admin from 'firebase-admin';
import * as functions from 'firebase-functions';

_admin.initializeApp(functions.config().credential);

export const admin = _admin;

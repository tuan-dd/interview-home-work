import SecretKey, { ISecretKey } from '@/models/SecretKeyStore';
import BaseService from './base.service';

class SecretKeyService extends BaseService<ISecretKey> {
  constructor() {
    super(SecretKey);
  }
}

export default new SecretKeyService();

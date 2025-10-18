import { useState, useEffect } from 'react';
import { User } from '../types';
import {  getStoredKeys, decodeSignature, verifyDecodedSignature } from '../utils/crypto';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';

interface CryptoVerificationProps {
  users: User[];
}

const CryptoVerification = ({ users }: CryptoVerificationProps) => {
  const [verificationResults, setVerificationResults] = useState<Record<string, boolean>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [keys, setKeys] = useState<any>(null);

  useEffect(() => {
    const storedKeys = getStoredKeys();
    setKeys(storedKeys);
  }, []);

  const verifyAllUsers = async () => {
    setIsVerifying(true);
    const results: Record<string, boolean> = {};

    for (const user of users) {
      if (user.signature) {
        try {
          // Decode the Base64-encoded signature JSON
          const decodedSignature = decodeSignature(user.signature);
          
          if (!decodedSignature) {
            console.error(`Failed to decode signature for user ${user.id}`);
            results[user.id] = false;
            continue;
          }
          
          // Verify using the decoded signature data (includes embedded public key)
          const isValid = await verifyDecodedSignature(user.email, decodedSignature);
          results[user.id] = isValid;
        } catch (error) {
          console.error(`Verification failed for user ${user.id}:`, error);
          results[user.id] = false;
        }
      } else {
        results[user.id] = false;
      }
    }

    setVerificationResults(results);
    setIsVerifying(false);
  };

  const getVerificationStatus = (userId: string) => {
    const result = verificationResults[userId];
    if (result === undefined) return 'unknown';
    return result ? 'valid' : 'invalid';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'invalid':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'invalid':
        return <Badge variant="destructive">Invalid</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const validCount = Object.values(verificationResults).filter(Boolean).length;
  const totalCount = users.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Cryptographic Verification
        </CardTitle>
        <CardDescription>
          Verify digital signatures for user email hashes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 text-blue-600">
          <Shield className="h-4 w-4" />
          <span className="text-sm">
            Using embedded signature data for verification
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Verified: {validCount} / {totalCount} users
            </p>
          </div>
          <Button 
            onClick={verifyAllUsers} 
            disabled={isVerifying}
            size="sm"
          >
            {isVerifying ? 'Verifying...' : 'Verify All'}
          </Button>
        </div>

        {users.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">User Verification Status</h4>
            <div className="space-y-1">
              {users.map((user) => {
                const status = getVerificationStatus(user.id);
                return (
                  <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status)}
                      <span className="text-sm font-medium">{user.email}</span>
                    </div>
                    {getStatusBadge(status)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>• Signatures are stored as Base64-encoded JSON with embedded public keys</p>
          <p>• Each signature contains its own public key for verification</p>
          <p>• Email hashing uses SHA-384 algorithm</p>
          <p>• Verification uses the embedded public key from each signature</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoVerification;

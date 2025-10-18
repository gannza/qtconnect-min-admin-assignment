import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { exportUsers, setUsers } from '../store/slices/userSlice';
import { decodeProtobufToUsers } from '../utils/protobuf';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Download, Upload, AlertCircle } from 'lucide-react';

const ProtobufExport = () => {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    
    try {
      await dispatch(exportUsers());
    } catch (error) {
      setError('Failed to export users');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const decodedUsers = await decodeProtobufToUsers(uint8Array);
      
      dispatch(setUsers(decodedUsers));
    } catch (error) {
      setError('Failed to import users. Please check the file format.');
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="mr-2 h-5 w-5" />
          Protobuf Export/Import
        </CardTitle>
        <CardDescription>
          Export users in protobuf format or import from a protobuf file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        <div className="flex space-x-4">
          <Button 
            onClick={handleExport} 
            disabled={isExporting || loading}
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export Users'}
          </Button>
          
          <div className="flex-1">
            <input
              type="file"
              accept=".pb,.protobuf"
              onChange={handleImport}
              disabled={isImporting}
              className="hidden"
              id="protobuf-import"
            />
            <Button 
              asChild 
              variant="outline" 
              disabled={isImporting}
              className="w-full"
            >
              <label htmlFor="protobuf-import" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                {isImporting ? 'Importing...' : 'Import Users'}
              </label>
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>• Export: Downloads users in protobuf format</p>
          <p>• Import: Upload a protobuf file to load users</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProtobufExport;

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { Document } from '../types/supplier';

interface DocumentUploadProps {
  documents: Document[];
  onUpload: (files: File[], type: string) => Promise<void>;
  onDelete: (documentUrl: string) => Promise<void>;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documents,
  onUpload,
  onDelete,
}) => {
  const [selectedType, setSelectedType] = useState<string>('Business License');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        await onUpload(Array.from(files), selectedType);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = async (documentUrl: string) => {
    try {
      await onDelete(documentUrl);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Documents
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Document Type</InputLabel>
          <Select
            value={selectedType}
            label="Document Type"
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <MenuItem value="Business License">Business License</MenuItem>
            <MenuItem value="Tax Certificate">Tax Certificate</MenuItem>
            <MenuItem value="Insurance">Insurance</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          disabled={isUploading}
        >
          Upload Document
          <input
            type="file"
            hidden
            multiple
            onChange={handleFileChange}
          />
        </Button>
      </Box>

      <List>
        {documents.map((doc, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={doc.type}
              secondary={new Date(doc.uploadDate).toLocaleDateString()}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(doc.fileUrl)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default DocumentUpload; 
export interface Message {
    id: number;
    content: string;
    sender: 'ai' | 'user';
    type: 'text' | 'link' | 'error';
    url?: string;
  }
  
  export interface TeacherDialogProps {
    studentName: string;
    instrument: string;
    onClose: () => void;
  }
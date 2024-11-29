import { v4 as uuidv4 } from 'uuid';

export interface Document {
  id: string;
  name: string;
  content: string;
}

export function useDocumentStore() {
  const documents = ref<Document[]>([]);

  const addDocument = (name: string, content: string) => {
    const doc: Document = {
      id: uuidv4(),
      name,
      content,
    };
    documents.value.push(doc);
    return doc;
  };

  const removeDocument = (id: string) => {
    documents.value = documents.value.filter(doc => doc.id !== id);
  };

  const clearDocuments = () => {
    documents.value = [];
  };

  const getDocumentContent = () => {
    return documents.value.map(doc => doc.content).join('\n\n');
  };

  return {
    documents,
    addDocument,
    removeDocument,
    clearDocuments,
    getDocumentContent,
  };
}

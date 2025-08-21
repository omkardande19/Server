import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DetailedViewProps {
  item: any; // Replace 'any' with a specific type if available
  onClose: () => void;
}

const DetailedView: React.FC<DetailedViewProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="p-6 bg-[#1A1A1A] max-w-lg w-full text-white">
        <h2 className="text-2xl font-bold mb-4">{item.title || item.user}</h2>
        <p className="mb-4">{item.description || item.content}</p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">To apply, please send your resume and cover letter to:</h3>
          <p className="text-primary"> {item.email} </p>
        </div>
        <Button className="mt-6 bg-primary hover:bg-primary/90 text-white" onClick={onClose}>Close</Button>
      </Card>
    </div>
  );
};

export default DetailedView;

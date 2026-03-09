export interface Wish {
  id: string;
  name: string;
  message: string;
  timestamp: number;
  reactions: {
    love?: number;
    celebrate?: number;
    cheer?: number;
    laugh?: number;
    rofl?: number;
    savage?: number;
  };
  type: 'wish' | 'roast';
}

import React from 'react';
import { UsageStrategyItem } from '../types';
import { Wand2Icon } from './icons';
import { formatCamelCase } from '../utils';

interface UsageStrategyTableProps {
  strategy: UsageStrategyItem[];
}

const UsageStrategyTable: React.FC<UsageStrategyTableProps> = ({ strategy }) => {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                    <th scope="col" className="px-6 py-3">Spending Category</th>
                    <th scope="col" className="px-6 py-3">Card to Use</th>
                    <th scope="col" className="px-6 py-3">Reason & Tips</th>
                </tr>
            </thead>
            <tbody>
                {strategy.map((item, i) => (
                    <tr key={i} className={`border-b last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 break-words">{formatCamelCase(item.category)}</th>
                        <td className="px-6 py-4 font-semibold text-primary break-words">{item.cardToUse}</td>
                        <td className="px-6 py-4 break-words">
                            {item.reason}
                            {item.trick && (
                                <div className="mt-3 p-2 bg-purple-50 rounded-md border-l-4 border-purple-400">
                                    <p className="text-xs text-purple-800 font-semibold flex items-center">
                                        <Wand2Icon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                                        <span>Pro Tip:</span>
                                    </p>
                                    <p className="text-xs text-gray-600 pl-5">{item.trick}</p>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};

export default UsageStrategyTable;
import React from 'react';
import { FileText, MessageSquare, Upload, Users } from 'lucide-react';

const stats = [
  { name: 'Total Documents', value: '128', icon: FileText },
  { name: 'Chat Sessions', value: '24', icon: MessageSquare },
  { name: 'Storage Used', value: '2.4 GB', icon: Upload },
  { name: 'Active Users', value: '12', icon: Users },
];

const recentActivity = [
  { id: 1, type: 'upload', user: 'John Doe', document: 'Q4 Report.pdf', time: '2 hours ago' },
  { id: 2, type: 'chat', user: 'Jane Smith', document: 'Product Specs.docx', time: '4 hours ago' },
  { id: 3, type: 'upload', user: 'Mike Johnson', document: 'Meeting Notes.pdf', time: '1 day ago' },
];

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ name, value, icon: Icon }) => (
          <div
            key={name}
            className="bg-white overflow-hidden rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {name}
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.type === 'upload' ? (
                      <Upload className="h-5 w-5 text-gray-400" />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.type === 'upload'
                        ? \`Uploaded \${activity.document}\`
                        : \`Chatted about \${activity.document}\`}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {activity.time}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
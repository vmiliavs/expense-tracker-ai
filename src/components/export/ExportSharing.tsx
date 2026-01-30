'use client';

import { useState } from 'react';
import { Expense } from '@/types/expense';
import { ShareableLink } from '@/types/cloud-export';
import { Button } from '@/components/ui/Button';
import QRCode from 'qrcode';

interface ExportSharingProps {
  expenses: Expense[];
}

export function ExportSharing({ expenses }: ExportSharingProps) {
  const [shareLinks, setShareLinks] = useState<ShareableLink[]>([
    {
      id: '1',
      url: 'https://expense.app/share/abc123xyz',
      expiresAt: '2026-02-15T00:00:00Z',
      accessCount: 12,
      createdAt: '2026-01-25T10:00:00Z',
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);

  const generateShareLink = async () => {
    setIsGenerating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const randomId = Math.random().toString(36).substring(7);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const newLink: ShareableLink = {
      id: Date.now().toString(),
      url: `https://expense.app/share/${randomId}`,
      expiresAt: expiresAt.toISOString(),
      accessCount: 0,
      createdAt: new Date().toISOString(),
    };

    setShareLinks((prev) => [newLink, ...prev]);
    setIsGenerating(false);
  };

  const generateQRCode = async (url: string) => {
    try {
      const qrUrl = await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#0c4a6e',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(qrUrl);
      setSelectedLink(url);
    } catch (error) {
      console.error('QR Code generation failed:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  const revokeLink = (id: string) => {
    setShareLinks((prev) => prev.filter((link) => link.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-1">Share & Collaborate</h4>
        <p className="text-xs text-gray-600">
          Generate secure links and QR codes to share your expense data
        </p>
      </div>

      {/* Generate New Link */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-sky-50 to-blue-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-1">
              Create Shareable Link
            </h5>
            <p className="text-xs text-gray-600">
              Generate a secure, time-limited link to share your expense data
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            onClick={generateShareLink}
            loading={isGenerating}
            disabled={isGenerating || expenses.length === 0}
            className="text-xs"
          >
            {isGenerating ? 'Generating...' : '🔗 Generate Share Link'}
          </Button>
          <span className="text-xs text-gray-600">
            • Link expires in 30 days
          </span>
        </div>
      </div>

      {/* Active Share Links */}
      {shareLinks.length > 0 && (
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-gray-900">Active Share Links</h5>
          {shareLinks.map((link) => (
            <div
              key={link.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-sky-300 transition-all"
            >
              <div className="space-y-3">
                {/* Link URL */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2">
                    <code className="text-xs text-gray-700 font-mono break-all">
                      {link.url}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(link.url)}
                    className="p-2 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded"
                    title="Copy link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => generateQRCode(link.url)}
                    className="p-2 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded"
                    title="Generate QR Code"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </button>
                </div>

                {/* Link Stats */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div>
                      <span className="text-gray-500">Views:</span>{' '}
                      <span className="font-medium text-gray-900">{link.accessCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Expires:</span>{' '}
                      <span className="font-medium text-gray-900">
                        {new Date(link.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>{' '}
                      <span className="font-medium text-gray-900">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => revokeLink(link.id)}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Display */}
      {qrCodeUrl && selectedLink && (
        <div className="border border-sky-300 rounded-lg p-6 bg-sky-50">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-48 h-48 border-4 border-white rounded-lg shadow-lg"
              />
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">
                QR Code Generated
              </h5>
              <p className="text-xs text-gray-600 mb-4">
                Scan this QR code with any mobile device to instantly access the shared expense data
              </p>
              <div className="space-y-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = qrCodeUrl;
                    link.download = 'expense-qr-code.png';
                    link.click();
                  }}
                  className="text-xs"
                >
                  Download QR Code
                </Button>
                <button
                  onClick={() => {
                    setQrCodeUrl(null);
                    setSelectedLink(null);
                  }}
                  className="text-xs text-gray-600 hover:text-gray-900 ml-3"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sharing Options */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">👥</span>
            <h5 className="text-sm font-semibold text-gray-900">Team Sharing</h5>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Invite team members to collaborate on expense reports
          </p>
          <Button variant="secondary" className="text-xs w-full">
            Invite Team
          </Button>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">🔐</span>
            <h5 className="text-sm font-semibold text-gray-900">Password Protected</h5>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Add password protection to your shared links
          </p>
          <Button variant="secondary" className="text-xs w-full">
            Enable Protection
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-gray-900 mb-3">Sharing Analytics</h5>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-sky-600">{shareLinks.length}</p>
            <p className="text-xs text-gray-600">Active Links</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {shareLinks.reduce((sum, link) => sum + link.accessCount, 0)}
            </p>
            <p className="text-xs text-gray-600">Total Views</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {expenses.length}
            </p>
            <p className="text-xs text-gray-600">Records Shared</p>
          </div>
        </div>
      </div>
    </div>
  );
}

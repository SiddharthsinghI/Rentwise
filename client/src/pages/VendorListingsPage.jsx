import React, { useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { AddEditProductModal } from '../components/vendor/AddEditProductModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { formatCurrency } from '../utils/formatters';
import {
  PlusCircle,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  Star,
  Package,
  AlertCircle
} from 'lucide-react';

export const VendorListingsPage = () => {
  const [searchParams] = useSearchParams();
  const { currentUser, isVendor } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [showAddModal, setShowAddModal] = useState(searchParams.get('action') === 'new');
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isVendor) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  // Filter vendor's own products
  const vendorProducts = products.filter((p) => p.vendorId === currentUser.id);
  const filteredListings = vendorProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct.id, deletingProduct.name);
      setDeletingProduct(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleAvailability = async (product) => {
    const nextStatus = product.availability === 'available' ? 'unavailable' : 'available';
    await updateProduct(product.id, { availability: nextStatus });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
            Catalog Management
          </span>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            My Equipment Listings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add, update, adjust rates, or temporarily disable gear from your inventory.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={PlusCircle}
          onClick={() => setShowAddModal(true)}
        >
          Add New Equipment
        </Button>
      </div>

      {/* Search and Count Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search my listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Total gear: <strong className="text-slate-900">{filteredListings.length}</strong> items
        </span>
      </div>

      {/* Listings Table / Cards */}
      {filteredListings.length === 0 ? (
        <EmptyState
          icon={Package}
          title={searchTerm ? 'No listings match your search' : 'No equipment listed yet'}
          description={
            searchTerm
              ? 'Try adjusting your search query.'
              : 'Add your first cinema camera, laptop workstation, projector, or power tool to start earning.'
          }
          actionLabel="Add Your First Listing"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Equipment</th>
                  <th className="px-6 py-4 whitespace-nowrap">Category</th>
                  <th className="px-6 py-4 whitespace-nowrap">Stock</th>
                  <th className="px-6 py-4 whitespace-nowrap">Daily Rate</th>
                  <th className="px-6 py-4 whitespace-nowrap">Deposit</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredListings.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Item */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5 min-w-[220px]">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80';
                          }}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-100 flex-shrink-0"
                        />
                        <div>
                          <Link
                            to={`/products/${product.id}`}
                            className="font-bold text-slate-900 hover:text-brand-600 transition-colors block line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                            <span className="font-mono">#{product.id}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                              <Star className="w-3 h-3 fill-amber-500" />
                              {product.rating || '5.0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 capitalize font-semibold text-slate-700 whitespace-nowrap">
                      {product.category}
                    </td>

                    {/* Stock Quantity */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200/80 shadow-2xs whitespace-nowrap">
                        <Package className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-bold text-slate-900">{product.totalQuantity || 1}</span>
                        <span className="text-slate-500">{product.totalQuantity === 1 ? 'unit' : 'units'}</span>
                      </div>
                    </td>

                    {/* Daily Rate */}
                    <td className="px-6 py-4 font-bold text-navy-950 font-sans text-sm whitespace-nowrap">
                      {formatCurrency(product.pricePerDay)} <span className="text-[11px] font-normal text-slate-400">/d</span>
                    </td>

                    {/* Deposit */}
                    <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">
                      {formatCurrency(product.securityDeposit)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleAvailability(product)}
                        className="group flex items-center gap-1.5 focus:outline-none"
                        title="Click to toggle availability"
                      >
                        <Badge status={product.availability} size="sm" />
                        <span className="text-[10px] text-slate-400 group-hover:text-brand-600 underline underline-offset-2 hidden sm:inline">
                          (Toggle)
                        </span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/products/${product.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          title="View public listing page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                          title="Edit equipment details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(product)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete equipment listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <AddEditProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={addProduct}
        vendorId={currentUser.id}
      />

      {/* Edit Product Modal */}
      {editingProduct && (
        <AddEditProductModal
          isOpen={Boolean(editingProduct)}
          onClose={() => setEditingProduct(null)}
          onSubmit={(data) => updateProduct(editingProduct.id, data)}
          initialData={editingProduct}
          vendorId={currentUser.id}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Listing?"
        message={`Are you sure you want to remove "${deletingProduct?.name}" from your listings? It will no longer be visible to renters in the marketplace.`}
        confirmText="Yes, Delete Listing"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

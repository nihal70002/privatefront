import { Trash2, CheckCircle } from "lucide-react";

export default function AddressCard({
  address,
  onDelete,
  onSetDefault
}) {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm relative">
      {address.isDefault && (
        <span className="absolute top-3 right-3 text-green-600 flex items-center gap-1 text-sm font-semibold">
          <CheckCircle className="w-4 h-4" />
          Default
        </span>
      )}

      <h4 className="font-bold text-gray-800">
        {address.fullName}
      </h4>

      <p className="text-sm text-gray-600 mt-1">
        {address.addressLine}, {address.city}, {address.state}
      </p>

      <p className="text-sm text-gray-600">
        Pincode: {address.pincode}
      </p>

      <p className="text-sm text-gray-600">
        Phone: {address.phone}
      </p>

      <div className="flex gap-4 mt-4">
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            className="text-teal-600 font-semibold text-sm"
          >
            Set as Default
          </button>
        )}

        <button
          onClick={() => onDelete(address.id)}
          className="text-red-500 text-sm font-semibold flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}

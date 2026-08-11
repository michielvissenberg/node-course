import { useUpdateProduct } from "@/lib/api-hooks.product";
import { FridgeView, ProductView } from "@node-course/api-sdk";
import { UseQueryResult } from "@tanstack/react-query";

export function Dropdown({
  fridges,
  product,
  onSuccess,

}: {
  fridges: UseQueryResult<NoInfer<FridgeView[]>, Error>;
  product: ProductView;
  onSuccess: () => void;
}){
  const updateProduct = useUpdateProduct();
  
  return (
    <div className="absolute left-0 top-12">
      <ul className="w-56 h-auto shadow-md rounded-md p-1 border bg-white">
        {fridges.data?.map((fridge, index) => (
          <li
            key={index}
            className={`relative flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 rounded-md`}
            onClick={() => {
              updateProduct.mutate(
                { 
                  id: product.id, 
                  body: { 
                    name: product.name, 
                    size: product.size, 
                    ownerId: product.ownerId, 
                    fridgeId: fridge.id, 
                  } 
                },
                {
                  onSuccess
                }
              );
            }}
          >
            Address: {fridge.address}, Floor: {fridge.floor}
          </li>
        ))}
      </ul>
    </div>
  );
}
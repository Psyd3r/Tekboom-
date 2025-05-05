
import { StockHeader } from "./Stock/StockHeader";
import { StockFilterButtons } from "./Stock/StockFilterButtons";
import { StockTable } from "./Stock/StockTable";
import { StockUpdateDialog } from "./Stock/StockUpdateDialog";
import { useStockManagement } from "./Stock/useStockManagement";

export function StockManagement() {
  const {
    products,
    isLoading,
    isUpdating,
    selectedProduct,
    isDialogOpen,
    setIsDialogOpen,
    newStock,
    setNewStock,
    stockType,
    stockFilter,
    setStockFilter,
    handleOpenDialog,
    handleUpdateStock
  } = useStockManagement();

  return (
    <div className="space-y-4">
      <StockHeader />
      
      <StockFilterButtons 
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
      />

      <StockTable
        isLoading={isLoading}
        products={products}
        handleOpenDialog={handleOpenDialog}
      />

      {selectedProduct && (
        <StockUpdateDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          selectedProduct={selectedProduct}
          stockType={stockType}
          newStock={newStock}
          setNewStock={setNewStock}
          isUpdating={isUpdating}
          handleUpdateStock={handleUpdateStock}
        />
      )}
    </div>
  );
}

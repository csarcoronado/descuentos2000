import 'bootstrap/dist/css/bootstrap.min.css'; 
import './caja.css'
import './pagos.css'
import './puntos.css'
import './estilos.css'
import { BorraIma} from '../interface/interfacesTabla';
import { useState } from "react";
import { useEffect } from 'react';
import { FaPercentage } from "react-icons/fa";
import {AiOutlinePlusCircle} from "react-icons/ai"
import { BsCashCoin } from "react-icons/bs"
import { IoRemoveCircleOutline, IoTrash } from 'react-icons/io5';
const u =()=>{
      //ESTAS SON LAS FUNCIONES PARA LOS PRODUCTOS
      const [selectedProductsList, setSelectedProductsList] = useState<BorraIma[]>([]);
       const [imageData, setImageData] = useState<BorraIma[]>([]);
       const [originalData, setOriginalData] = useState<BorraIma[]>([]);
       const [formData, setFormData] = useState<BorraIma>({name:'', precio: '', id:'', porcentaje:''});
       const [searchText, setSearchText] = useState('');
       const [selectedProduct, setSelectedProduct] = useState<BorraIma | null>(null);
       const [selectedProducts, setSelectedProducts] = useState(new Set());
       const [totalSubtotal, setTotalSubtotal] = useState<number>(0);
       const [tecladoVisible,] = useState(false);
       const [, setInput] = useState<string>('');
       const [activeInput, ] = useState('');
       const [isFieldSelected, setIsFieldSelected] = useState(false);
       const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
       const [inputs, ] = useState<string>('');
       const [totalAhorro, setTotalAhorro] = useState<number>(0);
       const [descuento, ] = useState(0);
       const [inputValues, ] = useState({
         id1: '',
         id2: '',
         id3: '', 
       });
       console.log(inputValues)
      console.log(imageData)
       const totalDeArticulos = imageData.length;
       const iva = 0.16;
       const calcularMontoIVA = () => {
         if (imageData.length > 0) {
           const totalSubtotal = imageData.reduce((total, data) => {
             return total + (parseFloat(calcularPrecioConDescuento(data.precio, data.porcentaje)) * Number(data.id));
           }, 0);
           const montoIVA = iva * totalSubtotal;
           return montoIVA.toFixed(2); // Redondear el resultado a dos decimales
         } else {
           return '0.00';
         }
       };
       useEffect(() => {
         // Calcula el subtotal total cuando cambia el estado imageData
         const newTotalSubtotal = imageData.reduce((total, data) => {
           return total + (parseFloat(calcularPrecioConDescuento(data.precio, data.porcentaje)) * Number(data.id));
         }, 0);
         setTotalSubtotal(newTotalSubtotal);
       }, [imageData]);
       useEffect(() => {
         const handleKeyDown = (e: { key: any; }) => {
           if (tecladoVisible && isFieldSelected) {
             const key = e.key;
             handleTecladoInput(key);
           }
         };
         document.addEventListener('keydown', handleKeyDown);
         return () => {
           document.removeEventListener('keydown', handleKeyDown);
         };
       }, [tecladoVisible, isFieldSelected]);
       const handleIncreaseAmount = (product: BorraIma) => {
         const updatedData = imageData.map((item) => {
           if (item === product) {
             return {
               ...item,
               id: String(parseInt(item.id) + 1), // Incrementa la cantidad
             };
           }
           return item;
         });
        setImageData(updatedData);
       };
       const handleInputChanges = (e: { target: any; }, selectedProduct: BorraIma | null) => {
         const newValue = e.target.value;
         const updatedData = imageData.map((item) => {
           if (item === selectedProduct) {
           return {
               ...item,
               cantidad: newValue,
             };
         }
           return item;
         });
         setImageData(updatedData);
       };
       const handleDecreaseAmount = (product: BorraIma) => {
         const updatedData = imageData.map((item) => {
           if (item === product) {
             const newAmount = parseInt(item.id) - 1;
             return{
              ...item,
               id: newAmount >= 0 ? String(newAmount) : item.id,
             };
           }
           return item;
         });
         setImageData(updatedData);
       };
       const addData = () => {
         if (formData.name && formData.precio && formData.id && formData.porcentaje) {
           const newData = { ...formData };
           const ahorroProducto = parseFloat(calcularPrecioConDescuentos(formData.precio, formData.porcentaje));
           setTotalAhorro((prevTotalAhorro) => prevTotalAhorro + ahorroProducto);
           setImageData([...imageData, newData]);
           setOriginalData([...originalData, newData]);
          setFormData({
             name: '',
             precio: '',
             id: '',
             porcentaje: '',
           });
           setDatosCompartidos({
            nombre: formData.name,
            precio: formData.precio,
            cantidad: formData.id,
            porcentajeDescuento: formData.porcentaje,
            // Actualiza otros campos según necesites
          });
         }
       };
       const handleSelectProduct = (product: BorraIma) => {
         const updatedSelectedProducts = new Set(selectedProducts);
         if (updatedSelectedProducts.has(product)) {
           updatedSelectedProducts.delete(product); // Deseleccionar el producto
         } else {
           updatedSelectedProducts.add(product); // Seleccionar el producto
         }
         setSelectedProducts(updatedSelectedProducts);

          // Actualizar la lista de productos seleccionados
          const selectedList = imageData.filter((data) => updatedSelectedProducts.has(data));
          setSelectedProductsList(selectedList);
       };
       const handleDeleteSelected = () => {
         // Elimina los productos seleccionados
         const updatedData = imageData.filter((data) => !selectedProducts.has(data));
         setImageData(updatedData);
         // Deselecciona todos los productos
         setSelectedProducts(new Set());
       };
       const showProductDetails = (product: BorraIma) => {
         setSelectedProduct(product);
       };
      const deleteProduct = (product: BorraIma) => {
         var opcion = window.confirm("Realmente quieres eliminar el producto");
         if (opcion) {
           // Mover el producto eliminado a los datos eliminados
           const updatedData = imageData.filter((item) => item !== product);
           setImageData(updatedData);
           setSelectedProduct(null);
         }
       };
      const handleTecladoInput = (key: string) => {
        if (tecladoVisible && isFieldSelected) {
          if (activeInput === 'searchText') {
            // Actualiza el valor del input de búsqueda
            setSearchText((prevSearchText) => prevSearchText + key);
            handleInputChanges({ target: { value: searchText + key } }, selectedProduct);
          } else if (activeInput === 'cantidad') {
            // Actualiza el valor del input de cantidad
            setInput((prevInput) => prevInput + key);
            handleInputChanges({ target: { value: inputs + key } }, selectedProduct);
          }
        }
      };
      const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
       const { name, value } = e.target;
       setFormData({
         ...formData,
         [name]: value,
       });
       setIsFieldSelected(false);
      };
      const calcularPrecioConDescuento = (precio: string , porcentaje: string | number) => {
      const descuento = (Number(porcentaje) / 100) * parseFloat(precio);
      const precioConDescuento = parseFloat(precio) - descuento;
      return precioConDescuento.toString();
      };
      const calcularPrecioConDescuentos = (precio: string, porcentaje: string) => {
        const descuento = (parseFloat(porcentaje) / 100) * parseFloat(precio);
        const ahorro = descuento * Number(formData.id);
        return ahorro.toFixed(2);
      };
      const aplicarDescuento = () => {
        const descuentoDecimal = descuentoPorcentaje - descuento;
        const newData = imageData.map((item) => {
          if (selectedProducts.has(item)) {
            const precioConDescuento = calcularPrecioConDescuento(item.precio, descuentoDecimal);
            return {
              ...item,
              precio: precioConDescuento,
            };
          }
          return item;
        });
    
        setImageData(newData);
      };
      const [, setDatosCompartidos] = useState({
        nombre: '',
        precio: '',
        cantidad: '',
        porcentajeDescuento: '',
        // Otros campos que necesites compartir
      });
return(
<div>
    <div>
          <div className='container111'>
            <label htmlFor="name">Nombre:</label>
              <input
              className='input'
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              />
          </div>
          <div className='container111'>
            <label htmlFor="precio">Precio:</label>
              <input
              className='input'
              type="text"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              />
          </div>
          <div className='container111'>
            <label htmlFor="id">Cantidad:</label>
              <input
              className='input'
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              />
          </div>
          <div className='container111'>
            <label htmlFor="porcentaje">Descuento:</label>
              <input
              className='input'
              type="text"
              id="porcentaje"
              name="porcentaje"
              value={formData.porcentaje}
              onChange={handleInputChange}
              />
          </div>
          <button className= "buttonmn" onClick={addData}>Agregar Datos</button>
          <table>
            <div className='table table-responsive' >
              <thead className=" table table-dark align-middle">
                <tr>
                  <th className='th'>Nombre</th>
                  <th className='th'>Precio</th>
                  <th className='th'>Subtotal</th>
                  <th className='th'>Cantidad</th> 
                  <th className='th'>
                  <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  %
</button>
                    <button className="btn-dark" onClick={aplicarDescuento}><FaPercentage /></button><button className="btn-dark" onClick={handleDeleteSelected}><IoTrash className='icon3'/></button></th>
                  <th className='th'>Porcentaje de Ahorro</th>
                  <th className='th'>c/Descuento</th>
                </tr>
              </thead>
            <tbody>
            {imageData.map((data, index) => (
            <tr className= 'align-middle' key={index} onClick={() => showProductDetails(data)}>
              <td>{data.name}</td>
              <td>{data.precio} </td>
              <td>
                ${(parseFloat(calcularPrecioConDescuento(data.precio, data.porcentaje)) * Number(data.id)).toFixed(2)}
                <div className="fixed"></div>
              </td>
              <td>
                <button className='btn' onClick={()=> handleIncreaseAmount(data)}><AiOutlinePlusCircle className='icon1'/></button>
                <input 
                className='inputg'
                type='text'
                id='id'
                value={data.id}
                >
                </input>
                <button className='btn' onClick={()=> handleDecreaseAmount(data)}><IoRemoveCircleOutline className='icon1'/></button>
                <button className="btn" onClick={() => deleteProduct(data)}><IoTrash className='icon2'/></button>
              </td>  
              <td><input type='checkbox' checked={selectedProducts.has(data)} onChange={() => handleSelectProduct(data)}/></td>
              <td>%{data.porcentaje}</td>
              <td>${calcularPrecioConDescuento(data.precio, data.porcentaje)}</td>
            </tr> 
            ))}
            </tbody>
            </div>
          </table>
          <table>
            <div className='table table'>
              <thead className='table-dark alig-middle'>
                <tr>
                  <th className='th' >Otros costos</th>
                  <th className='th'>Total Ahorrado</th>
                  <th className='th'>Iva</th>
                  <th className='th'>Subtotal</th>
                  <th className='th'>Total <BsCashCoin className= 'color'/> </th>
                  <th className='th'>Total de articulos</th>
                  <th className='th'></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>${totalAhorro.toString()}</td>
                  <td>${calcularMontoIVA()}</td>
                  <td>${totalSubtotal.toString()}</td>
                  <td>${(parseFloat(calcularMontoIVA()) + Number(totalSubtotal)).toFixed(2)}</td>
                  <td>{totalDeArticulos}</td>
                </tr>
              </tbody>
            </div>
          </table> 
        </div>
        <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Descuento Global</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                  <div className='taes'>              
                      {selectedProductsList.map((data, index) => (
                        <p key={index}>{data.name}</p>
                      ))}
                  </div>
                <input type="number" value={descuentoPorcentaje} onChange={(e) => {
                  const inputValue = parseFloat(e.target.value);
                  if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 100) {
                    setDescuentoPorcentaje(inputValue);
                  }
                }}/>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger colorCe" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" className="btn btn-primary totales" data-bs-dismiss="modal"  onClick={aplicarDescuento}>Aplicar descuento</button>
              </div>
            </div>
          </div>
        </div>
    </div>
)
}
export default u
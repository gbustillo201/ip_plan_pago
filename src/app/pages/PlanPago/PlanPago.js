import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom'
import useAPICall from "../../useAPICall";
import { GetPlanPago } from "../../services/cuotasApi";
import { EstadoCuenta } from "../../components/EstadoCuenta";
import { DistribucionCuotas } from "../../components/DistribucionCuotas";
import { ProyeccionMultas } from "../../components/ProyeccionMultas";
import QRCode from "qrcode.react";
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
const queryString = require("query-string");

const Header = ({ planId, hasError }) => {

    const url = `${process.env.REACT_APP_PLAN}?planpago=${planId}`;
    const justify = hasError ? 'justify-content-center' : 'justify-content-between'
    return (
        <div className={`d-flex flex-wrap ${justify} p-3`}>
            <img
                className="card-media  d-block mx-auto"
                src={process.env.PUBLIC_URL + "/logo IP.png"}
                alt=""
            />
            {

                !hasError && <div className="d-flex flex-column align-items-center mx-auto mt-4">
                    <QRCode className="qr-box" value={url} />
                    <p className="plan-id">Nº {`${planId}`} </p>
                </div>
            }

        </div>
    )
}

const DatosGenerales = ({ placa, rtn, propietario, solicitanteNombre, solicitanteIdentificacion }) => {

    return (
        <>
            <h5 className="text-center plan-datos-title">Datos de Identificacion</h5>


            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr className="plan-datos-header">
                            <th>
                                Placa
                            </th>
                            <th>
                                RTN
                            </th>
                            <th>
                                Propietario
                            </th>
                            <th>Identidad solicitante</th>
                            <th>Solicitante</th>
                        </tr>

                    </thead>
                    <tbody>
                        <tr className="plan-datos-items">
                            <td>{placa}</td>
                            <td>{rtn}</td>
                            <td>{propietario}</td>
                            <td>{solicitanteIdentificacion}</td>
                            <td>{solicitanteNombre}</td>

                        </tr>
                    </tbody>
                </table>

            </div>
        </>
    )
}

const DatosRecepcion = ({ dateLegend }) => {
    return (
        <>
            <h5 className="text-center plan-datos-title mt-5">Datos de Recepcion</h5>


            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr className="plan-datos-header">
                            <th>
                                Fecha
                        </th>
                            <th>
                                Id Funcionario
                        </th>
                            <th>
                                Nombre Funcionario
                        </th>

                        </tr>

                    </thead>
                    <tbody>
                        <tr className="plan-datos-items">
                            <td className="pt-0">{dateLegend}</td>
                            <td className="pt-0">{"8888-8888-88888"}</td>
                            <td className="pt-0">{"Web"}</td>

                        </tr>
                    </tbody>
                </table>

            </div>
        </>
    )
}

const Observaciones = () => {
    return <div className="observaciones mt-5">
        <p >Observación:</p>
        <p className="text-justify">La falta de pago de dos pagos consecutivos o tres alternos en los plazos previstos en el presente convenio será causal suficiente para la suspensión de los beneficios obtenidos y que el Instituto de la Propiedad prosiga a su cobro por la vía legal sin perjuicio de otras acciones administrativas como la publicación de lo adeudado en la página de la Institución.</p>
        <p className="text-justify">"Además me comprometo a pagar la mora que se encuentra registrada en el sistema y que no se incluyo en el presente plan"</p>
        {/* <p className="text-center  firmas">Nombre y Firma del Usuario o <br />Representante Legal</p>
        <div className="d-flex justify-content-between flex-wrap">
            <p className="text-lg-left text-center firmas">Nombre y Firma del Oficial <br /> de Planes de Pago</p>
            <p className="firmas"> Nombre y Firma Gerente de Registro Vehicular o <br /> Gerente de Centro de Atención</p>

        </div> */}
    </div>
}

const PlanPagos = ({isMobile}) => {
   
    const { planId } = useParams();
    const history = useHistory();
    
    if (!planId) {
        history.push("/")
    }
   
    
    
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,

    });


    const [planPagos, error, getPlanPagos] = useAPICall(GetPlanPago)

    const { placa, propietario, rtn, solicitanteNombre,
        fechaEmision,
        solicitanteIdentificacion, estadoCuenta, distribucionCuotas, proyeccionMultas } = planPagos || {};

    useEffect(() => {
        getPlanPagos({ planId })
    }, []);

    useEffect(()=>{
        if(isMobile && planPagos){
            handlePrint();
        }

    }, [isMobile, planPagos])


    const dateLegend = (planPagoDate) => {

        return moment(planPagoDate).format('DD/MM/YYYY, h:mm:ss a')
    }

    const mapDistribucionCuotas = (distribucion) => {
        return {
            distribucionCuotas: distribucion
        }
    }

    

    

    return (
        <div className={`card w-100 PrintPlan `} ref={componentRef}>
            <Header planId={planId} hasError={error} />


            {
                !error && planPagos && <div className="card-body">
                    <div id="subscription">
                        <h1 className="card-title plan-pago-title text-center ">Convenio de Plan de Pago</h1>
                        <div className="d-flex justify-content-end">
                            <button id="btn-print" className="btn btn-primary" onClick={handlePrint}>
                            Imprimir &nbsp;
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-printer-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5z" />
                                    <path fillRule="evenodd" d="M11 9H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z" />
                                    <path fillRule="evenodd" d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
                                </svg>
                                
                                </button>
                        </div>

                        <div className="plan-pago-final mt-5">
                            <DatosGenerales placa={placa} rtn={rtn} propietario={propietario} solicitanteNombre={solicitanteNombre} solicitanteIdentificacion={solicitanteIdentificacion} />

                            <div className="plan-pago-estado-cuenta">
                                <div className="plan-pagos-table">
                                    <EstadoCuenta estadoCuenta={estadoCuenta} />
                                    <ProyeccionMultas proyeccionMultas={proyeccionMultas} />
                                    <DistribucionCuotas distribucion={mapDistribucionCuotas(distribucionCuotas)} />
                                </div>

                                <DatosRecepcion dateLegend={dateLegend(fechaEmision)} />
                                <Observaciones />



                            </div>

                        </div>
                    </div>
                </div>
            }
            {
                error && <div className="card-body">
                    <h3 className="message-error-text">{error}</h3>
                </div>

            }

        </div>
    )
}

export default PlanPagos;


import React, { useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import useAPICall from "../../useAPICall";
import { GetPlanPago } from "../../services/cuotasApi";
import { EstadoCuenta } from "../../components/EstadoCuenta";
import { DistribucionCuotas } from "../../components/DistribucionCuotas";
import { ProyeccionMultas } from "../../components/ProyeccionMultas";
import QRCode from "qrcode.react";
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';

const Header = ({ planId, hasError }) => {

    const url = `${process.env.REACT_APP_PLAN}/${planId}`;
    const justify = hasError? 'justify-content-center': 'justify-content-between'
    return (
        <div className={`d-flex ${justify} p-3`}>
            <img
                className="card-media  d-block"
                src={process.env.PUBLIC_URL + "/logo IP.png"}
                alt=""
            />
            {

                !hasError && <div className="d-flex flex-column align-items-center">
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
                            <td className="pt-0">{"888888"}</td>
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
        <p className="text-justify">La falta de pago de dos (2) cuotas en los plazos previstos en el presente Convenio de Pago, será causal suficiente para que el Instituto de la Propiedad prosiga su cobro por la vía legal, sin perjuicio de otras acciones administrativas como la publicación del adeudo en la página de la Institución.</p>
        <p className="text-justify">"Además me comprometo a pagar la mora que se encuentra registrada en el sistema y que no se incluyo en el presente plan"</p>
        <p className="text-center  firmas">Nombre y Firma del Usuario o <br />Representante Legal</p>
        <div className="d-flex justify-content-between flex-wrap">
            <p className="text-lg-left text-center firmas">Nombre y Firma del Oficial <br /> de Planes de Pago</p>
            <p className="firmas"> Nombre y Firma Gerente de Registro Vehicular o <br /> Gerente de Centro de Atención</p>

        </div>
    </div>
}

const PlanPagos = () => {
    const { planId } = useParams();
    const history = useHistory();
    if (!planId) {
        history.push("/")
    }

    const [planPagos, error, getPlanPagos] = useAPICall(GetPlanPago)

    const { placa, propietario, rtn, solicitanteNombre,
        fechaEmision,
        solicitanteIdentificacion, estadoCuenta, distribucionCuotas, proyeccionMultas } = planPagos || {};

    useEffect(() => {
        getPlanPagos({ planId })
    }, []);


    const dateLegend = (planPagoDate) => {

        return moment(planPagoDate).format('DD/MM/YYYY, h:mm:ss a')
    }

    const mapDistribucionCuotas = (distribucion) => {
        return {
            distribucionCuotas: distribucion
        }
    }

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,

    });

    return (
        <div className="card w-100 PrintPlan" ref={componentRef}>
            <Header planId={planId} hasError={error} />


            {
                !error && planPagos && <div className="card-body">
                    <div id="subscription">
                        <h1 className="card-title plan-pago-title text-center ">Convenio de Plan de Pago</h1>

                      
                        <div className="plan-pago mt-5">
                            <DatosGenerales placa={placa} rtn={rtn} propietario={propietario} solicitanteNombre={solicitanteNombre} solicitanteIdentificacion={solicitanteIdentificacion} />

                            <div className="plan-pago-estado-cuenta">
                                <div className="plan-pagos-table">
                                    <EstadoCuenta estadoCuenta={estadoCuenta} />
                                    <ProyeccionMultas proyeccionMultas={proyeccionMultas} />
                                    <DistribucionCuotas distribucion={mapDistribucionCuotas(distribucionCuotas)} />
                                </div>

                                <DatosRecepcion dateLegend={dateLegend(fechaEmision)} />
                                <Observaciones />
                                <div className="d-flex justify-content-center"> 
                                <button id="btn-print" className="btn btn-primary" onClick={handlePrint}>Imprimir Plan de Pago</button>
                                </div>
                                

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


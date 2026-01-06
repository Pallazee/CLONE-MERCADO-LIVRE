import React from "react";
import { createPreference } from "../../services/api";

import {
  Container,
  Condition,
  Row,
  HeartIcon,
  DispatchTag,
  PriceCard,
  PriceRow,
  InstallmentsInfo,
  StockStatus,
  MethodCard,
  CheckIcon,
  Actions,
  Button,
  Benefits,
  ShieldIcon,
} from "./styles";

const ProductAction: React.FC = () => {
  const handleBuyNow = async () => {
    try {
      const data = await createPreference();

      if (!data.id) {
        throw new Error("Preference ID não retornado");
      }

      window.location.href = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${data.id}`;
    } catch (error) {
      console.error(error);
      alert("Erro ao iniciar pagamento");
    }
  };

  return (
    <Container>
      <Condition>Novo | 9 vendidos</Condition>

      <Row>
        <h1>Camiseta Branca</h1>
        <HeartIcon />
      </Row>

      <DispatchTag>Enviando normalmente</DispatchTag>

      <PriceCard>
        <PriceRow>
          <span className="symbol">R$</span>
          <span className="fraction">1</span>
          <span className="cents">99</span>
        </PriceRow>

        <InstallmentsInfo>em 3x de R$ 0,68</InstallmentsInfo>
      </PriceCard>

      <StockStatus>Estoque disponível</StockStatus>

      <MethodCard>
        <CheckIcon />
        <div>
          <span className="title">Frete Grátis</span>
          <span className="details">Benefício Lorem Ipsum</span>
          <a href="#">Ver mais opções</a>
        </div>
      </MethodCard>

      <Actions>
        <Button solid onClick={handleBuyNow}>
          Comprar agora
        </Button>

        <Button>Adicionar ao carrinho</Button>
      </Actions>

      <Benefits>
        <li>
          <ShieldIcon />
          <p>
            Compra Garantida, receba o produto que está esperando ou devolvemos
            seu dinheiro.
          </p>
        </li>
      </Benefits>
    </Container>
  );
};

export default ProductAction;

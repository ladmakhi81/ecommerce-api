import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  InitialZarinpalPayGatewayDTO,
  InitialZarinpalPayGatewayResponseDTO,
  VerifyTransactionBankDTO,
  VerifyTransactionBankResponseDTO,
} from './dtos';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ZarinpalService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private _getInitialRequestURL() {
    return this.configService.get('ZARINPAL_REQUEST_URL');
  }

  private _getMerchantId() {
    return this.configService.get('ZARINPAL_MERCHANT_ID');
  }

  private _getCallbackURL() {
    return this.configService.get('ZARINPAL_CALLBACK_URL');
  }

  private _getVerifyURL() {
    return this.configService.get<string>('ZARINPAL_VERIFY_URL');
  }

  private _generateZarinpalPayLink(authority: string) {
    return this.configService.get('ZARINPAL_PAY_URL') + authority;
  }

  async initializePaymentGateway(amount: number) {
    const baseUrl = this._getInitialRequestURL();
    const callbackUrl = this._getCallbackURL();
    const merchantId = this._getMerchantId();
    const body: InitialZarinpalPayGatewayDTO = {
      callback_url: callbackUrl,
      description: 'zarinpal',
      merchant_id: merchantId,
      amount: amount * 10,
    };
    try {
      const response = await firstValueFrom(
        this.httpService.post<InitialZarinpalPayGatewayResponseDTO>(
          baseUrl,
          body,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        ),
      );
      const authority = response.data.data.authority;
      const payLink = this._generateZarinpalPayLink(authority);
      return { payLink, authority };
    } catch (error: any) {
      console.log(error?.response?.data?.errors);
      throw new BadRequestException(
        'Something Went Wrong With Bank, Try Again',
      );
    }
  }

  async verifyTransactionBank(dto: VerifyTransactionBankDTO) {
    const body = {
      ...dto,
      merchant_id: this._getMerchantId(),
      amount: dto.amount * 10,
      authority: dto.authority,
    };
    try {
      const response = await firstValueFrom(
        this.httpService.post<VerifyTransactionBankResponseDTO>(
          this._getVerifyURL(),
          body,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      const refId = response.data.data.ref_id.toString();
      if (!refId) {
        throw new BadRequestException();
      }
      return refId;
    } catch {
      throw new BadRequestException('Bank Is Not Verifying The Payment');
    }
  }
}

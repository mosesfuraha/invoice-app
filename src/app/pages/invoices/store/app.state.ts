import { ThemeState } from '../../../theme/theme.reducer';
import { InvoiceState } from '../reducers/invoices.reducer';

export interface AppState {
  theme: ThemeState;
  invoices: InvoiceState;
}

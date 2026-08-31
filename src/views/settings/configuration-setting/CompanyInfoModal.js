import { yupResolver } from "@hookform/resolvers/yup";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateCompanyInfo } from "src/store/apps/config/configCompany";
import BaseModal from "src/views/common/BaseModal";
import FormInputText from "src/views/common/Form/FormInputText";
import FormFileUpload from "src/views/common/Form/FormFileUpload";
import * as yup from 'yup';

export default function CompanyInfoModal({
  open,
  setOpen,
  companyInfo, // This can be either processed data or raw API response
  onUpdate
}) {
  const dispatch = useDispatch();
  const { loadingUpdateCompanyInfo } = useSelector(state => state.companyConfig);

  const schema = yup.object().shape({
    companyName: yup.string().required('Nama company harus diisi'),
    companyNamePos: yup.string().optional(),
    ptName: yup.string().required('Nama PT harus diisi'),
    address: yup.string().required('Alamat harus diisi'),
    city: yup.string().required('Kota harus diisi'),
    phoneNumber: yup.string().required('Nomor telepon harus diisi'),
    ownerName: yup.string().required('Approval SO harus diisi'),
    ownerTitle: yup.string().required('Jabatan Approval SO harus diisi'),
    bank: yup.string().required('Informasi bank harus diisi'),
    ppn: yup.string().optional(),
    logo: yup.mixed().optional().nullable(true),
  });

  // Handle both processed data (from store selectors) and raw API response
  const companyData = companyInfo?.value_json ? companyInfo.value_json : companyInfo;

  const defaultValues = {
    companyName: companyData?.companyName || "Toko Jaya Makmur",
    companyNamePos: companyData?.companyNamePos || "Toko Jaya Makmur",
    ptName: companyData?.ptName || "PT TJAHAYA BERKAT ABADI",
    address: companyData?.address || "Jl. Raya Kebayoran Lama No. 555",
    city: companyData?.city || "Grogol Selatan, Jakarta Selatan 12220",
    phoneNumber: companyData?.phoneNumber || "081807922555",
    ownerName: companyData?.ownerName || "Michael Santoso",
    ownerTitle: companyData?.ownerTitle || "Finance Dept",
    bank: companyData?.bank || "248 882 2298 BCA a/n PT TJAHAYA BERKAT ABADI",
    ppn: companyData?.ppn || "",
    logo: null,
  };

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    // Prepare the base configuration data
    const configData = {
      key: "COMPANY_INFO",
      value: "",
      category: "COMPANY_INFO",
      value_json: {
        companyName: data.companyName,
        companyNamePos: data.companyNamePos,
        ptName: data.ptName,
        address: data.address,
        city: data.city,
        phoneNumber: data.phoneNumber,
        ownerName: data.ownerName,
        ownerTitle: data.ownerTitle,
        bank: data.bank,
        ppn: data.ppn,
        // logoUrl will be updated by the backend when file is uploaded
        ...(companyData?.logoUrl && { logoUrl: companyData.logoUrl }),
      },
      description: "Company Info",
    };

    let payload;

    // If there's a logo file, use FormData
    if (data.logo && data.logo instanceof File) {
      console.log('Using FormData for file upload');
      const formData = new FormData();

      // Add config data directly (no JSON.stringify)
      Object.keys(configData).forEach(key => {
        if (key === 'value_json') {
          // Add each value_json property as separate form field
          Object.keys(configData[key]).forEach(jsonKey => {
            formData.append(`value_json.${jsonKey}`, configData[key][jsonKey]);
          });
        } else {
          formData.append(key, configData[key]);
        }
      });

      // Add logo file
      formData.append('logo', data.logo);
      console.log('Logo file added:', data.logo.name, data.logo.size);

      // Debug FormData before sending
      // console.log('FormData being sent:');
      for (let [key, value] of formData.entries()) {
        // console.log(key, value);
      }

      payload = formData;
    } else {
      // No file, use regular JSON
      // console.log('Using regular JSON payload');
      // console.log('JSON payload:', configData);
      payload = configData;
    }

    dispatch(updateCompanyInfo({
      id: companyInfo.id,
      payload: payload,
      setOpen
    })).then(() => {
      onUpdate(); // Refresh the data
    });
  };

  return (
    <BaseModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title="Edit Company Information"
      size="md"
      showActions={true}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6}>
          <FormInputText
            name="companyName"
            control={control}
            label="Company Name"
            placeholder="Enter company name"
            errors={errors}
            loading={loadingUpdateCompanyInfo}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputText
            name="companyNamePos"
            control={control}
            label="Company Name POS"
            placeholder="Enter POS company name (optional)"
            errors={errors}
            loading={loadingUpdateCompanyInfo}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputText
            name="ptName"
            control={control}
            label="PT Name"
            placeholder="Enter PT name"
            errors={errors}
            loading={loadingUpdateCompanyInfo}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputText
            name="ownerName"
            control={control}
            label="Approval SO & PO"
            placeholder="Michael"
            errors={errors}
            loading={loadingUpdateCompanyInfo}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputText
            name="ownerTitle"
            control={control}
            label="Approval SO & PO Title"
            placeholder="Finance Dept"
            errors={errors}
            loading={loadingUpdateCompanyInfo}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputText
            name="city"
            control={control}
            label="City"
            placeholder="Enter city"
            errors={errors}
            loading={loadingUpdateCompanyInfo}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputText
            name="phoneNumber"
            control={control}
            label="Phone Number"
            placeholder="Enter phone number"
            errors={errors}
            loading={loadingUpdateCompanyInfo}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInputText
            name="ppn"
            control={control}
            label="PPN"
            placeholder="10%"
            errors={errors}
            loading={loadingUpdateCompanyInfo}
          />
        </Grid>

        <Grid item xs={12}>
          <FormInputText
            name="bank"
            control={control}
            label="Bank Information"
            placeholder="Enter bank information"
            errors={errors}
            loading={loadingUpdateCompanyInfo}
            required
            multiline={true}
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <FormInputText
            name="address"
            control={control}
            label="Address"
            placeholder="Enter company address"
            errors={errors}
            loading={loadingUpdateCompanyInfo}
            required
            multiline={true}
            rows={3}
          />
        </Grid>

        <Grid item xs={12}>
          <FormFileUpload
            name="logo"
            control={control}
            label="Company Logo"
            accept="image/*"
            currentImageUrl={companyInfo?.value_json?.logoUrl}
            errors={errors}
          />
        </Grid>
      </Grid>
    </BaseModal>
  );
}

$(() => {

    $("#tree").dynatree({
        children: [
            {
                title: "C:\\", isFolder: true, key: "C:\\",
                isLazy: true
            }
        ],
        onLazyRead: (node) => {
            node.appendAjax({
                url: "/api/directory",
                data: {
                    unc: node.data.key,
                }
            });
        },
        onClick: (node) => {
            ShowAcl(node.data.key);
            return true;
        },
        clickFolderMode: 1
    });
});

interface DirectorySecurity {
    AreAccessRulesProtected: boolean;
    AreAuditRulesProtected: boolean;
    AreAccessRulesCanonical: boolean;
    AreAuditRulesCanonical: boolean;
}

class AccessRule extends Backbone.Model {
    attributes: {
        FileSystemRights: number;
        AccessControlType: number;
        IdentityReference: {
            Value: string;
        };
        IsInherited: boolean;
        InheritanceFlags: number;
        PropagationFlags: number;
    }

    public getApplyOnto() {
        return {
            ThisFolder: !(this.attributes.PropagationFlags & WinApi.PropagationFlags.InheritOnly),
            Subfolder: Boolean(this.attributes.InheritanceFlags & WinApi.InheritanceFlags.ContainerInherit),
            File: Boolean(this.attributes.InheritanceFlags & WinApi.InheritanceFlags.ObjectInherit)
        }
    }

    public getFileSystemRightsString() {
        return (new FileSystemRights(this.get("FileSystemRights"))).toString();
    }

    constructor(attributes?: any, options?: any) {
        attributes.FileSystemRights = GenericAccessRights.expand(attributes.FileSystemRights);

        super(attributes, options);
    }
}

class AccessRules extends Backbone.Collection<AccessRule> {
}






// 概要:
//     アクセス規則と監査規則の作成時に使用するアクセス権を定義します。
class FileSystemRights {
    mask: number;

    constructor(mask: number) {
        this.mask = mask;
    }


    toString() {
        var ret: string[] = [];

        ["FullControl", "Modify", "Write", "ReadAndExecute", "Read", "ReadData", "CreateDirectories", "CreateFiles"].forEach((name) => {
            if ((this.mask & FileSystemRights[name]) === FileSystemRights[name]) {
                ret.push(name);
            };
        });

        if (ret.length > 0)
            return ret.join(",");
        else
            return "";
    }

    // 概要:
    //     ディレクトリの内容を読み取る権限を指定します。
    static ListDirectory = 1;
    //
    // 概要:
    //     ファイルまたはフォルダーを開いたり、コピーしたりする権限を指定します。 これには、ファイル システム属性、拡張ファイル システム属性、またはアクセス規則や監査規則を読み取る権限は含まれません。
    static ReadData = 1;
    //
    // 概要:
    //     ファイルを作成する権限を指定します。
    static CreateFiles = 2;
    //
    // 概要:
    //     ファイルまたはフォルダーを開いたり、ファイルまたはフォルダーに書き込んだりする権限を指定します。 これには、ファイル システム属性、拡張ファイル
    //     システム属性、またはアクセス規則や監査規則を開いたり書き込んだりする権限は含まれません。
    static WriteData = 2;
    //
    // 概要:
    //     フォルダーを作成する権限を指定します。
    static CreateDirectories = 4;
    //
    // 概要:
    //     ファイルの末尾にデータを追加する権限を指定します。
    static AppendData = 4;
    //
    // 概要:
    //     フォルダーまたはファイルの拡張ファイル システム属性を開いたり、コピーしたりする権限を指定します。 たとえば、この値は、作成者や内容に関する情報を表示する権限を指定します。
    //     これには、データ、ファイル システム属性、またはアクセス規則や監査規則を読み取る権限は含まれません。
    static ReadExtendedAttributes = 8;
    //
    // 概要:
    //     フォルダーまたはファイルの拡張ファイル システム属性を開いたり、フォルダーまたはファイルに拡張ファイル システム属性を書き込んだりする権限を指定します。
    //     これには、データ、属性、またはアクセス規則や監査規則を書き込む権限は含まれません。
    static WriteExtendedAttributes = 16;
    //
    // 概要:
    //     アプリケーション ファイルを実行する権限を指定します。
    static ExecuteFile = 32;
    //
    // 概要:
    //     フォルダーの内容を一覧表示し、そのフォルダーに格納されているアプリケーションを実行する権限を指定します。
    static Traverse = 32;
    //
    // 概要:
    //     フォルダーおよびそのフォルダー内に格納されているファイルを削除する権限を指定します。
    static DeleteSubdirectoriesAndFiles = 64;
    //
    // 概要:
    //     フォルダーまたはファイルのファイル システム属性を開いたり、コピーしたりする権限を指定します。 たとえば、この値は、ファイルの作成日や変更日を表示する権限を指定します。
    //     これには、データ、拡張ファイル システム属性、またはアクセス規則や監査規則を読み取る権限は含まれません。
    static ReadAttributes = 128;
    //
    // 概要:
    //     フォルダーまたはファイルのファイル システム属性を開いたり、フォルダーまたはファイルにファイル システム属性を書き込んだりする権限を指定します。
    //     これには、データ、拡張属性、またはアクセス規則や監査規則を書き込む権限は含まれません。
    static WriteAttributes = 256;
    //
    // 概要:
    //     フォルダーおよびファイルを作成し、ファイルに対してデータの追加または削除を行う権限を指定します。 この権限には、System.Security.AccessControl.FileSystemRights.WriteData
    //     権限、System.Security.AccessControl.FileSystemRights.AppendData 権限、System.Security.AccessControl.FileSystemRights.WriteExtendedAttributes
    //     権限、および System.Security.AccessControl.FileSystemRights.WriteAttributes 権限が含まれます。
    static Write = 278;
    //
    // 概要:
    //     フォルダーまたはファイルを削除する権限を指定します。
    static Delete = 65536;
    //
    // 概要:
    //     フォルダーまたはファイルのアクセス規則や監査規則を開いたり、コピーしたりする権限を指定します。 これには、データ、ファイル システム属性、および拡張ファイル
    //     システム属性を読み取る権限は含まれません。
    static ReadPermissions = 131072;
    //
    // 概要:
    //     フォルダーまたはファイルを読み取り専用として開いたり、コピーしたりする権限を指定します。 この権限には、System.Security.AccessControl.FileSystemRights.ReadData
    //     権限、System.Security.AccessControl.FileSystemRights.ReadExtendedAttributes
    //     権限、System.Security.AccessControl.FileSystemRights.ReadAttributes 権限、および System.Security.AccessControl.FileSystemRights.ReadPermissions
    //     権限が含まれます。
    static Read = 131209;
    //
    // 概要:
    //     フォルダーまたはファイルを読み取り専用として開いたりコピーしたりする権限、およびアプリケーション ファイルを実行する権限を指定します。 この権限には、System.Security.AccessControl.FileSystemRights.Read
    //     権限および System.Security.AccessControl.FileSystemRights.ExecuteFile 権限が含まれます。
    static ReadAndExecute = 131241;
    //
    // 概要:
    //     読み取り、書き込み、フォルダーの内容の一覧表示、フォルダーとファイルの削除、およびアプリケーション ファイルの実行を行う権限を指定します。 この権限には、System.Security.AccessControl.FileSystemRights.ReadAndExecute
    //     権限、System.Security.AccessControl.FileSystemRights.Write 権限、および System.Security.AccessControl.FileSystemRights.Delete
    //     権限が含まれます。
    static Modify = 197055;
    //
    // 概要:
    //     ファイルまたはフォルダーに関連付けられたセキュリティ規則と監査規則を変更する権限を指定します。
    static ChangePermissions = 262144;
    //
    // 概要:
    //     フォルダーまたはファイルの所有者を変更する権限を指定します。 リソースの所有者は、そのリソースに対してフル アクセス権限を持ちます。
    static TakeOwnership = 524288;
    //
    // 概要:
    //     ファイル ハンドルが I/O 操作の完了に同期するまでアプリケーションが待機できるかどうかを指定します。
    static Synchronize = 1048576;
    //
    // 概要:
    //     フォルダーまたはファイルに対してフル コントロールを行い、アクセス制御と監査規則を変更する権限を指定します。 この値は、ファイルに対してどのような操作でも行うことができる権限を表します。この値は、この列挙体のすべての権限を組み合わせたものです。
    static FullControl = 2032127;
}


class GenericAccessRights {
    private flag: number;
    private standard: number;

    constructor(flag, standard) {
        this.flag = flag | 0;
        this.standard = standard;
    }

    static All: GenericAccessRights = new GenericAccessRights(parseInt("10000000", 16), FileSystemRights.FullControl);
    static Execute: GenericAccessRights = new GenericAccessRights(parseInt("20000000", 16), FileSystemRights.ExecuteFile);
    static Write: GenericAccessRights = new GenericAccessRights(parseInt("40000000", 16), FileSystemRights.Write);
    static Read: GenericAccessRights = new GenericAccessRights(parseInt("80000000", 16), FileSystemRights.Read);

    static expand(mask: number) {
        [this.All, this.Execute, this.Write, this.Read].forEach((val) => {
            if ((mask & val.flag) === val.flag) {
                mask &= (~val.flag);
                mask |= val.standard;
            }
        });
        return mask;
    }
};

module WinApi {
    export enum PropagationFlags {
        // 概要:
        //     継承フラグが設定されていないことを指定します。
        None = 0,
        //
        // 概要:
        //     ACE を子オブジェクトに反映させないことを指定します。
        NoPropagateInherit = 1,
        //
        // 概要:
        //     ACE を子オブジェクトだけに反映させることを指定します。 この操作には、子コンテナー オブジェクトと子リーフ オブジェクトの両方が含まれます。
        InheritOnly = 2,
    }

    /** 概要:継承フラグでは、アクセス制御エントリ (ACE: Access Control Entry) の継承のセマンティクスを指定します。*/
    export enum InheritanceFlags {
        /** 概要:ACE は、子オブジェクトによって継承されません。 */
        None = 0,
        /** 概要:ACE は、子コンテナー オブジェクトによって継承されます。 */
        ContainerInherit = 1,
        /** 概要:ACE は、子リーフ オブジェクトによって継承されます。 */
        ObjectInherit = 2,
    }
}

class AccessRuleView extends Backbone.View<AccessRule> {
    template: (...any) => string;
    model: AccessRule;
    
    constructor(options?: Backbone.ViewOptions<AccessRule>) {
        this.tagName = "tr";
        this.template = _.template($("#access_rule_template").html());
        this.events = <any>{
            "click": () => {
                console.log(this);
            }
        };
        super(options);
    }

    render() {
        
        this.$el
            .html(this.template($.extend({}, this.model.toJSON())))
     //       .attr(<Object> this.model.attributes)
            .addClass(this.model.attributes.IsInherited ? "inherited" : "unique")
        ;

        var applyOnto = this.model.getApplyOnto();
        $.each(applyOnto, (idx, val) => {
            this.$el.toggleClass(idx, val);
        });

        return this;
    }
}

interface DirectorySecurityInfo {
    DirectorySecurity: DirectorySecurity;
    AccessRules: AccessRule[];
}

class ACE extends Backbone.Model {
}

function ShowAcl(unc: string) {
    var $aclTree = $("#acltree"),
        $tbody = $aclTree.find("tbody");

    var securityRequest = $.ajax("/api/directorysecurity", {
        data: {
            unc: unc,
        },
    });



    $tbody.empty();
    securityRequest.done((data: DirectorySecurityInfo) => {
        
        data.AccessRules.forEach((rule) => {
            var view = new AccessRuleView({
                model: new AccessRule(rule)
            });


            $tbody.append(view.render().$el);
            return;
        });
    });

}

setTimeout(() => {
    ShowAcl("C:\\");
}, 100);